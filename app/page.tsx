"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SimulationPanel from "@/components/simulation/simulation-panel"
import VisualizationPanel from "@/components/simulation/visualization-panel"
import ComparisonPanel from "@/components/simulation/comparison-panel"
import EducationalPanel from "@/components/simulation/educational-panel"
import { MemoryProvider } from "@/context/memory-context"
import { ActivitySquare, HelpCircle, Check, X } from "lucide-react"

export default function VirtualMemoryManager() {
  const [activeTab, setActiveTab] = useState("visualization")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({})
  const [showResults, setShowResults] = useState(false)

  const quizQuestions = [
  {
    question: "Your system suddenly experiences a surge in page faults despite adding more RAM. What’s the most likely culprit?",
    options: [
      "Belady’s Anomaly",
      "LRU algorithm malfunction",
      "Cache overflow",
      "TLB corruption"
    ],
    answer: "Belady’s Anomaly"
  },
  {
    question: "Which best describes the purpose of a Translation Lookaside Buffer (TLB)?",
    options: [
      "Caching frequently used instructions",
      "Speeding up virtual-to-physical address translation",
      "Maintaining system logs",
      "Storing recent disk I/O operations"
    ],
    answer: "Speeding up virtual-to-physical address translation"
  },
  {
    question: "You're designing a system for real-time processing. Which page replacement algorithm would you likely avoid and why?",
    options: [
      "Optimal – It’s non-causal and theoretical",
      "FIFO – Too memory-intensive",
      "LRU – Unpredictable in high-speed systems",
      "Clock – Too slow in practice"
    ],
    answer: "Optimal – It’s non-causal and theoretical"
  },
  {
    question: "A program accesses memory in a strictly sequential manner. Which page replacement strategy performs best?",
    options: [
      "FIFO",
      "Optimal",
      "LRU",
      "All perform roughly the same"
    ],
    answer: "All perform roughly the same"
  },
  {
    question: "Imagine a program that uses a loop accessing a small set of pages repeatedly. What happens to its working set?",
    options: [
      "It stabilizes to a small size",
      "It grows infinitely",
      "It becomes highly fragmented",
      "It causes thrashing"
    ],
    answer: "It stabilizes to a small size"
  },
  {
    question: "Why might FIFO perform worse than LRU in some workloads?",
    options: [
      "It evicts pages regardless of usage recency",
      "It uses more memory than LRU",
      "It doesn't maintain a page table",
      "It swaps physical pages with virtual"
    ],
    answer: "It evicts pages regardless of usage recency"
  },
  {
    question: "What does a high TLB hit rate imply about your system?",
    options: [
      "It spends less time translating addresses",
      "It's overheating from high usage",
      "Its disk I/O is optimized",
      "It’s using FIFO successfully"
    ],
    answer: "It spends less time translating addresses"
  },
  {
    question: "Which situation is most likely to cause thrashing?",
    options: [
      "Working set exceeds physical memory",
      "Too many TLB entries",
      "Low CPU temperature",
      "Optimal algorithm is used"
    ],
    answer: "Working set exceeds physical memory"
  },
  {
    question: "Why is the Optimal algorithm impractical in real systems?",
    options: [
      "It requires future knowledge of memory accesses",
      "It needs excessive RAM",
      "It has high CPU cost",
      "It’s not supported by hardware"
    ],
    answer: "It requires future knowledge of memory accesses"
  },
  {
    question: "Which best describes the Clock algorithm?",
    options: [
      "A practical approximation of LRU using reference bits",
      "A FIFO variant using real-time timers",
      "A predictive algorithm using historical data",
      "A recursive strategy for page reuse"
    ],
    answer: "A practical approximation of LRU using reference bits"
  }
];


  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!showResults) {
      setUserAnswers(prev => ({...prev, [questionIndex]: answer}))
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quizQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correct++
      }
    })
    return correct
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
  }

  return (
    <MemoryProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Advanced Virtual Memory Manager</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SimulationPanel />
          <VisualizationPanel />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-400 to-blue-600 shadow-lg p-1">
            <TabsTrigger
              value="visualization"
              className="text-white font-semibold rounded-md hover:bg-white/20 data-[state=active]:bg-white/30 data-[state=active]:text-white transition-colors duration-300"
            >
              Access Pattern
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="text-white font-semibold rounded-md hover:bg-white/20 data-[state=active]:bg-white/30 data-[state=active]:text-white transition-colors duration-300"
            >
              Algorithm Comparison
            </TabsTrigger>
            <TabsTrigger
              value="educational"
              className="text-white font-semibold rounded-md hover:bg-white/20 data-[state=active]:bg-white/30 data-[state=active]:text-white transition-colors duration-300"
            >
              Educational
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="text-white font-semibold rounded-md hover:bg-white/20 data-[state=active]:bg-white/30 data-[state=active]:text-white transition-colors duration-300"
            >
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization">
            <Card>
              <CardHeader className="bg-gradient-to-tr from-rose-600 via-pink-500 to-fuchsia-500 rounded-t-xl shadow-md backdrop-blur-sm">
                <div className="flex justify-between items-start p-2">
                  <div className="space-y-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <ActivitySquare className="w-5 h-5 text-yellow-200" />
                      Page Access Pattern
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm">
                      Visualization of memory access behavior and state transitions over time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] overflow-auto">
                  <VisualizationPanel detailed />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonPanel />
          </TabsContent>

          <TabsContent value="educational">
            <EducationalPanel />
          </TabsContent>

          <TabsContent value="quiz">
            <Card>
              <CardHeader className="bg-gradient-to-tr from-red-700 via-red-500 to-pink-500 rounded-t-xl shadow-md backdrop-blur-sm">
                <div className="flex justify-between items-start p-2">
                  <div className="space-y-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-yellow-200" />
                      Quiz Zone
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm">
                      Test your understanding of memory concepts and algorithms
                    </CardDescription>
                  </div>
                  <div className="text-white/80">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showResults ? (
                  <>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-medium text-lg">
                          {quizQuestions[currentQuestion].question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {quizQuestions[currentQuestion].options.map((option, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              className={`h-auto py-3 text-left justify-start ${
                                userAnswers[currentQuestion] === option
                                  ? "bg-blue-50 border-blue-500 text-blue-700"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleAnswerSelect(currentQuestion, option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      
                      {currentQuestion < quizQuestions.length - 1 ? (
                        <Button
                          onClick={handleNextQuestion}
                          disabled={!userAnswers[currentQuestion]}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setShowResults(true)}
                          disabled={!userAnswers[currentQuestion]}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300 shadow-md text-center mb-6">
  <h3 className="text-2xl font-bold mb-3 text-gray-800">
    Your Score: {calculateScore()} / {quizQuestions.length}
  </h3>
  <p className={`text-lg font-medium ${
    calculateScore() === quizQuestions.length
      ? "text-green-600"
      : calculateScore() >= quizQuestions.length * 0.7
      ? "text-blue-600"
      : "text-orange-600"
  }`}>
    {calculateScore() === quizQuestions.length
      ? "Perfect! 🎉 You're a memory management expert!"
      : calculateScore() >= quizQuestions.length * 0.7
      ? "Well done! 👍 Keep learning!"
      : "Good attempt! 💪 Review the concepts and try again!"}
  </p>
</div>
                    
                    <div className="space-y-6">
                      {quizQuestions.map((q, index) => (
                        <div key={index} className="space-y-3 border-b pb-4">
                          <h3 className="font-medium">
                            {index + 1}. {q.question}
                          </h3>
                          <div className="text-sm">
                            <p className={`mb-1 ${
                              userAnswers[index] === q.answer 
                                ? "text-green-600 font-medium"
                                : userAnswers[index] 
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }`}>
                              Your answer: {userAnswers[index] || "Not answered"}
                            </p>
                            {userAnswers[index] !== q.answer && (
                              <p className="text-green-600 font-medium">
                                Correct answer: {q.answer}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-6"
                      onClick={resetQuiz}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MemoryProvider>
  )
}