"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Loader, Copy, Download, RotateCcw, Zap } from "lucide-react"
import { InterviewFeedback } from "@/components/interview-feedback"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: Array<{
    type: "positive" | "improvement" | "tip"
    text: string
  }>
}

interface SessionMetrics {
  questionsAsked: number
  avgScore: number
  strengths: string[]
  improvements: string[]
}

function AIInterviewContent() {
  const [mode, setMode] = useState<"technical" | "hr">("technical")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI interview coach. Let's practice a technical interview. I'll ask you a question, and you'll walk me through your approach and solution. Ready?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showMetrics, setShowMetrics] = useState(true)
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    questionsAsked: 1,
    avgScore: 0,
    strengths: ["Clear communication"],
    improvements: ["Consider edge cases"],
  })

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `That's a great approach! Let me provide some feedback on your answer...`,
        timestamp: new Date(),
        feedback: [
          { type: "positive", text: "You explained your approach clearly" },
          { type: "improvement", text: "Consider optimizing for space complexity" },
          { type: "tip", text: "Always ask clarifying questions first" },
        ],
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleNewSession = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI interview coach. Let's practice a new interview. Choose your preferred type and difficulty level.",
        timestamp: new Date(),
      },
    ])
    setSessionMetrics({
      questionsAsked: 1,
      avgScore: 0,
      strengths: [],
      improvements: [],
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Interview Coach</h1>
          <p className="text-foreground/60">Practice with real-time feedback and personalized coaching</p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setMode("technical")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all border ${
              mode === "technical"
                ? "border-primary/50 bg-primary/20 text-primary"
                : "border-border/50 hover:border-primary/40 hover:bg-primary/5 bg-transparent"
            }`}
          >
            Technical Interview
          </button>
          <button
            onClick={() => setMode("hr")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all border ${
              mode === "hr"
                ? "border-primary/50 bg-primary/20 text-primary"
                : "border-border/50 hover:border-primary/40 hover:bg-primary/5 bg-transparent"
            }`}
          >
            HR Interview
          </button>
        </div>

        {/* Main Interview Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-border/50 bg-card/50 h-96 md:h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary to-accent text-foreground"
                          : "bg-background/60 border border-border/30 text-foreground/90"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.feedback && <InterviewFeedback feedback={msg.feedback} />}
                      <span className="text-xs opacity-70 mt-2 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Loader size={16} className="animate-spin" />
                    <span className="text-sm">AI Coach is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-2 text-sm rounded-lg bg-background/50 border border-border/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 flex items-center gap-2"
                >
                  <Send size={16} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Metrics Sidebar */}
          {showMetrics && (
            <div className="space-y-4">
              <Card className="p-6 border-border/50 bg-card/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Session Metrics</h3>
                  <button
                    onClick={() => setShowMetrics(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1">Questions Asked</p>
                    <p className="text-2xl font-bold text-primary">{sessionMetrics.questionsAsked}</p>
                  </div>

                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1">Average Score</p>
                    <p className="text-2xl font-bold text-accent">{sessionMetrics.avgScore}%</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-primary mb-2">Strengths</p>
                    <div className="space-y-1">
                      {sessionMetrics.strengths.map((strength, i) => (
                        <div key={i} className="text-xs text-green-400 flex items-center gap-1">
                          <span>✓</span>
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-primary mb-2">Areas to Improve</p>
                    <div className="space-y-1">
                      {sessionMetrics.improvements.map((improve, i) => (
                        <div key={i} className="text-xs text-yellow-400 flex items-center gap-1">
                          <span>!</span>
                          {improve}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50 hover:bg-primary/10 bg-transparent flex items-center justify-center gap-1"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50 hover:bg-primary/10 bg-transparent flex items-center justify-center gap-1"
                    >
                      <Download size={14} />
                      Export
                    </Button>
                  </div>

                  <Button
                    onClick={handleNewSession}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw size={16} />
                    New Session
                  </Button>
                </div>
              </Card>

              {/* Pro Tips */}
              <Card className="p-6 border-border/50 bg-card/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-primary" />
                  <h3 className="font-bold">Pro Tips</h3>
                </div>
                <ul className="space-y-2 text-xs text-foreground/70">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Think out loud while solving</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Clarify requirements first</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Mention your assumptions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Discuss trade-offs</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function AIInterviewPage() {
  return (
    <ProtectedRoute>
      <AIInterviewContent />
    </ProtectedRoute>
  )
}
