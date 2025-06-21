"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemory } from "@/context/memory-context"
import { calculateWorkingSet } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VisualizationPanelProps {
  detailed?: boolean
}

export default function VisualizationPanel({ detailed = false }: VisualizationPanelProps) {
  const {
    algorithm,
    memoryState,
    frameCount,
    parsedReferenceString,
    currentStep,
    history,
    pageFaults,
    pageHits,
    tlbEnabled,
    tlbHits,
    tlbMisses,
    workingSetSize,
  } = useMemory()

  const currentPage = currentStep < parsedReferenceString.length ? parsedReferenceString[currentStep] : null
  const lastFault = history.length > 0 && currentStep > 0 ? history[currentStep - 1]?.fault : false
  const lastReplaced = history.length > 0 && currentStep > 0 ? history[currentStep - 1]?.replaced : undefined
  const currentWorkingSetSize = calculateWorkingSet(history, workingSetSize, currentStep)

  return (
    <Card className={`${detailed ? "" : "lg:col-span-2"} bg-card text-card-foreground`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-foreground">Memory Visualization</CardTitle>
            <CardDescription className="text-muted-foreground">
              Algorithm: <span className="font-semibold text-foreground">{algorithm.toUpperCase()}</span>
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
              Faults: <span className="font-semibold text-red-500 dark:text-red-300 ml-1">{pageFaults}</span>
            </Badge>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              Hits: <span className="font-semibold text-green-500 dark:text-green-300 ml-1">{pageHits}</span>
            </Badge>
            {tlbEnabled && (
              <>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                  TLB Hits: <span className="font-semibold text-blue-500 dark:text-blue-300 ml-1">{tlbHits}</span>
                </Badge>
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800">
                  TLB Misses: <span className="font-semibold text-purple-500 dark:text-purple-300 ml-1">{tlbMisses}</span>
                </Badge>
              </>
            )}
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
              Working Set: <span className="font-semibold text-yellow-600 dark:text-yellow-300 ml-1">{currentWorkingSetSize}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Memory Frames</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-muted-foreground">Hit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-xs text-muted-foreground">Fault</span>
                </div>
                {tlbEnabled && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-xs text-muted-foreground">TLB Hit</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: frameCount }).map((_, index) => {
                const value = memoryState[index]
                const isEmpty = value === undefined
                const isLastReplaced = lastReplaced === value && !isEmpty

                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            flex items-center justify-center h-12 rounded-md border-2 relative
                            ${isEmpty ? "border-dashed border-muted" : "border-solid border-border"}
                            ${isLastReplaced ? "border-red-500" : ""}
                            bg-background
                          `}
                        >
                          <span className={`text-lg font-semibold ${isEmpty ? "text-muted-foreground" : "text-foreground"}`}>
                            {isEmpty ? "Empty" : value}
                          </span>
                          {!isEmpty && <div className="absolute top-1 right-1 text-xs text-muted-foreground">{index + 1}</div>}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-card border-border text-foreground">
                        <p>Frame {index + 1}</p>
                        {!isEmpty && <p>Page {value}</p>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Current Request</h3>
            <div className="flex items-center space-x-4">
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-md border-2
                  ${currentPage !== null ? "bg-muted" : "bg-background border-dashed"}
                  border-border
                `}
              >
                <span className="text-lg font-semibold text-foreground">
                  {currentPage !== null ? currentPage : "-"}
                </span>
              </div>

              {currentStep > 0 && (
                <div
                  className={`
                    px-4 py-2 rounded-md text-white
                    ${lastFault ? "bg-red-500" : "bg-green-500"}
                  `}
                >
                  {lastFault ? "Page Fault" : "Page Hit"}
                </div>
              )}

              {tlbEnabled && currentStep > 0 && history[currentStep - 1]?.tlbHit !== undefined && (
                <div
                  className={`
                    px-4 py-2 rounded-md text-white
                    ${history[currentStep - 1]?.tlbHit ? "bg-blue-500" : "bg-purple-500"}
                  `}
                >
                  {history[currentStep - 1]?.tlbHit ? "TLB Hit" : "TLB Miss"}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Access History</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          flex items-center justify-center w-8 h-8 rounded-md border
                          ${item.fault ? "bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700" : "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700"}
                          ${item.tlbHit ? "ring-2 ring-blue-400" : ""}
                          ${index === currentStep - 1 ? "outline outline-2 outline-primary" : ""}
                        `}
                      >
                        <span className="text-sm font-medium text-foreground">{item.page}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border text-foreground">
                      <p>
                        Step {index + 1}: Page {item.page}
                      </p>
                      <p>{item.fault ? "Fault" : "Hit"}</p>
                      {item.replaced !== undefined && <p>Replaced: Page {item.replaced}</p>}
                      {item.tlbHit !== undefined && <p>{item.tlbHit ? "TLB Hit" : "TLB Miss"}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {detailed && (
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2 text-foreground">Memory Timeline</h3>
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Timeline header */}
                  <div className="flex border-b border-border">
                    <div className="w-16 shrink-0 p-2 font-medium text-foreground">Step</div>
                    {parsedReferenceString.map((_, index) => (
                      <div
                        key={index}
                        className={`
                          w-10 shrink-0 p-2 text-center font-medium
                          ${index === currentStep - 1 ? "bg-primary/10 text-foreground" : "text-muted-foreground"}
                        `}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* Reference string row */}
                  <div className="flex border-b border-border bg-muted">
                    <div className="w-16 shrink-0 p-2 font-medium text-foreground">Access</div>
                    {parsedReferenceString.map((page, index) => (
                      <div
                        key={index}
                        className={`
                          w-10 shrink-0 p-2 text-center
                          ${index === currentStep - 1 ? "bg-primary/10 font-bold text-foreground" : "text-foreground"}
                        `}
                      >
                        {page}
                      </div>
                    ))}
                  </div>

                  {/* Memory state visualization for each frame */}
                  {Array.from({ length: frameCount }).map((_, frameIndex) => (
                    <div key={frameIndex} className="flex border-b border-border">
                      <div className="w-16 shrink-0 p-2 font-medium text-foreground">Frame {frameIndex + 1}</div>
                      {parsedReferenceString.map((_, index) => {
                        const historyItem = history[index]
                        const pageInFrame = historyItem?.frames[frameIndex]

                        return (
                          <div
                            key={index}
                            className={`
                              w-10 shrink-0 p-2 flex items-center justify-center
                              ${index === currentStep - 1 ? "bg-primary/10" : ""}
                            `}
                          >
                            {index < history.length && pageInFrame !== undefined && (
                              <div className="w-6 h-6 bg-muted rounded-sm flex items-center justify-center">
                                <span className="text-xs text-foreground">{pageInFrame}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}