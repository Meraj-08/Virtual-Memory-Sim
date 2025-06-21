"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemory } from "@/context/memory-context"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from "recharts"
import { getAlgorithmDescription } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ChevronDown, ChevronUp, Award } from "lucide-react"
import { useState } from "react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ComparisonPanel() {
  const { comparisonData } = useMemory()
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<string | null>(null)

  // Calculate performance metrics for radar chart
  const radarData = comparisonData.map(algorithm => ({
    subject: algorithm.name,
    efficiency: algorithm.efficiency,
    faults: 100 - (algorithm.pageFaults / (algorithm.pageFaults + algorithm.pageHits)) * 100,
    speed: 100 - (algorithm.pageFaults * 0.5),
    memory: 100 - (algorithm.pageFaults * 0.3)
  }))

  // Sort by efficiency (descending)
  const sortedData = [...comparisonData].sort((a, b) => b.efficiency - a.efficiency)

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-t-xl shadow-md backdrop-blur-sm">
        <div className="flex justify-between items-start p-2">
          <div className="space-y-1">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Algorithm Performance Dashboard
            </CardTitle>
            <CardDescription className="text-white/80 text-sm">
              Compare page replacement strategies with detailed metrics and visualizations
            </CardDescription>
          </div>
          <div className="mt-1">
            <Badge className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-inner">
              {comparisonData.length} Algorithms
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {comparisonData.length > 0 ? (
          <>
            {/* Performance Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Best Performer Card */}
  <Card className="p-4 bg-white border border-green-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Best Performer</p>
        <h3 className="text-lg font-semibold text-gray-800">{sortedData[0]?.name}</h3>
      </div>
      <Award className="w-6 h-6 text-green-600" />
    </div>
    <div className="mt-2">
      <span className="text-2xl font-bold text-green-600">{sortedData[0]?.efficiency}%</span>
      <span className="text-sm text-gray-500 ml-1">efficiency</span>
    </div>
  </Card>

  {/* Fewest Faults Card */}
  <Card className="p-4 bg-white border border-blue-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Fewest Faults</p>
        <h3 className="text-lg font-semibold text-gray-800">
          {[...comparisonData].sort((a, b) => a.pageFaults - b.pageFaults)[0]?.name}
        </h3>
      </div>
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {[...comparisonData].sort((a, b) => a.pageFaults - b.pageFaults)[0]?.pageFaults} faults
      </Badge>
    </div>
  </Card>

  {/* Most Hits Card */}
  <Card className="p-4 bg-white border border-purple-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Most Hits</p>
        <h3 className="text-lg font-semibold text-gray-800">
          {[...comparisonData].sort((a, b) => b.pageHits - a.pageHits)[0]?.name}
        </h3>
      </div>
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        {[...comparisonData].sort((a, b) => b.pageHits - a.pageHits)[0]?.pageHits} hits
      </Badge>
    </div>
  </Card>
</div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Page Faults Comparison
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Lower is better
                  </Badge>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                      <YAxis tick={{ fill: '#6b7280' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Bar 
                        dataKey="pageFaults" 
                        name="Page Faults" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      >
                        {sortedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Performance Radar Analysis
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Higher is better
                  </Badge>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      {['efficiency', 'faults', 'speed', 'memory'].map((key, i) => (
                        <Radar
                          key={key}
                          name={key.charAt(0).toUpperCase() + key.slice(1)}
                          dataKey={key}
                          stroke={COLORS[i % COLORS.length]}
                          fill={COLORS[i % COLORS.length]}
                          fillOpacity={0.4}
                        />
                      ))}
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Algorithm Details */}
            <Card className="p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Detailed Algorithm Performance</h3>
              <div className="space-y-4">
                {sortedData.map((data, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div 
                      className="grid grid-cols-12 items-center gap-4 p-4 cursor-pointer hover:bg-gray-800"
                      onClick={() => setExpandedAlgorithm(expandedAlgorithm === data.name ? null : data.name)}
                    >
                      <div className="col-span-2 font-medium flex items-center gap-2">
                        {index < 3 && (
                          <Badge variant="secondary" className={`px-2 ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            #{index + 1}
                          </Badge>
                        )}
                        {data.name}
                      </div>
                      <div className="col-span-7">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500" 
                              style={{ width: `${data.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm w-12 text-right font-medium">{data.efficiency}%</span>
                        </div>
                      </div>
                      <div className="col-span-3 flex gap-2 justify-end">
                        <Badge variant="outline" className="px-2 py-0.5 text-xs">
                          {data.pageFaults} Faults
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5 text-xs bg-green-50 text-green-700">
                          {data.pageHits} Hits
                        </Badge>
                        {expandedAlgorithm === data.name ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {expandedAlgorithm === data.name && (
                      <div className="p-4 bg-gray-900 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 text-white">Algorithm Description</h4>
                            <p className="text-sm text-gray-300">
                              {getAlgorithmDescription(data.name)}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 text-white">Performance Metrics</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-300">
                                <span className="text-gray-400">Hit Rate:</span>
                                <span className="font-medium ml-2 text-white">
                                  {Math.round((data.pageHits / (data.pageHits + data.pageFaults)) * 100)}%
                                </span>
                              </div>
                              <div className="text-sm text-gray-300">
                                <span className="text-gray-400">Fault Rate:</span>
                                <span className="font-medium ml-2 text-white">
                                  {Math.round((data.pageFaults / (data.pageHits + data.pageFaults)) * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600">No Comparison Data</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Run complete simulations with multiple algorithms to see detailed performance comparisons and insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}