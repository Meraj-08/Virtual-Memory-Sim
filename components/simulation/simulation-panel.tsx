"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useMemory } from "@/context/memory-context"
import { getAlgorithmDescription } from "@/lib/utils"
import { Settings, RefreshCcw, Play, Pause, SkipForward } from "lucide-react"

export default function SimulationPanel() {
  const {
    algorithm,
    frameCount,
    referenceString,
    speed,
    isRunning,
    isComplete,
    tlbEnabled,
    tlbSize,
    workingSetSize,
    setAlgorithm,
    setFrameCount,
    setReferenceString,
    setSpeed,
    startSimulation,
    pauseSimulation,
    stepSimulation,
    resetSimulation,
    generateRandomString,
    setTlbEnabled,
    setTlbSize,
    setWorkingSetSize
  } = useMemory()

  return (
    <Card className="lg:col-span-1 shadow-lg border border-muted rounded-2xl">
      <CardHeader className="bg-muted/20 rounded-t-2xl py-5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-muted-foreground" />
          Simulation Settings
        </CardTitle>
        <CardDescription>
          Configure the algorithm and tune simulation parameters
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 py-6 px-6">
        {/* Algorithm Selector */}
        <div className="space-y-2">
          <Label htmlFor="algorithm" className="text-sm font-medium">Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger id="algorithm">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fifo">FIFO</SelectItem>
              <SelectItem value="lru">LRU</SelectItem>
              <SelectItem value="optimal">Optimal</SelectItem>
              <SelectItem value="clock">Clock (Second Chance)</SelectItem>
              <SelectItem value="nfu">NFU</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {getAlgorithmDescription(algorithm)}
          </p>
        </div>

        {/* Number of Frames */}
        <div className="space-y-2">
          <Label htmlFor="frames" className="text-sm font-medium">Frames</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="frames"
              min={1}
              max={10}
              step={1}
              value={[frameCount]}
              onValueChange={(value) => setFrameCount(value[0])}
            />
            <span className="w-10 text-center text-sm font-semibold text-primary">{frameCount}</span>
          </div>
        </div>

        {/* Reference String */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="reference" className="text-sm font-medium">Reference String</Label>
            <Button variant="outline" size="sm" onClick={generateRandomString}>
              Random
            </Button>
          </div>
          <Input
            id="reference"
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
            placeholder="e.g., 1,2,3,4,1,2,5..."
          />
        </div>

        {/* Simulation Speed */}
        <div className="space-y-2">
          <Label htmlFor="speed" className="text-sm font-medium">Speed (ms)</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="speed"
              min={100}
              max={2000}
              step={100}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
            />
            <span className="w-12 text-center text-sm font-semibold text-primary">{speed}</span>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="pt-4 border-t border-muted space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Advanced Options</h3>

          {/* TLB Switch */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tlb-switch">TLB Simulation</Label>
              <p className="text-xs text-muted-foreground">
                Simulate Translation Lookaside Buffer
              </p>
            </div>
            <Switch
              id="tlb-switch"
              checked={tlbEnabled}
              onCheckedChange={setTlbEnabled}
            />
          </div>

          {/* TLB Size */}
          {tlbEnabled && (
            <div className="space-y-2">
              <Label htmlFor="tlb-size">TLB Size</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="tlb-size"
                  min={1}
                  max={8}
                  step={1}
                  value={[tlbSize]}
                  onValueChange={(value) => setTlbSize(value[0])}
                />
                <span className="w-10 text-center text-sm font-semibold text-primary">{tlbSize}</span>
              </div>
            </div>
          )}

          {/* Working Set Size */}
          <div className="space-y-2">
            <Label htmlFor="working-set">Working Set Window</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="working-set"
                min={2}
                max={6}
                step={1}
                value={[workingSetSize]}
                onValueChange={(value) => setWorkingSetSize(value[0])}
              />
              <span className="w-10 text-center text-sm font-semibold text-primary">{workingSetSize}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Number of recent accesses to consider as the working set
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="flex justify-between px-6 py-4 border-t bg-muted/10 rounded-b-2xl">
        <Button variant="outline" onClick={resetSimulation}>
          <RefreshCcw className="w-4 h-4 mr-1.5" /> Reset
        </Button>

        {isRunning ? (
          <Button variant="secondary" onClick={pauseSimulation}>
            <Pause className="w-4 h-4 mr-1.5" /> Pause
          </Button>
        ) : (
          <Button onClick={startSimulation}>
            <Play className="w-4 h-4 mr-1.5" /> Start
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={stepSimulation}
          disabled={isRunning || isComplete}
        >
          <SkipForward className="w-4 h-4 mr-1.5" /> Step
        </Button>
      </CardFooter>
    </Card>
  )
}
