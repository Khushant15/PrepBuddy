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

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          mode,
        }),
      })

      const data = await res.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI Error:", error)

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "⚠️ Failed to get AI response. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const handleNewSession = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI interview coach. Let's practice a new interview.",
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
      <div className="container mx-auto max-w-6xl px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Interview Coach</h1>
          <p className="text-foreground/60">
            Practice with real-time feedback and personalized coaching
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-4 mb-8">

          <button
            onClick={() => setMode("technical")}
            className={`px-6 py-3 rounded-lg font-semibold border ${
              mode === "technical"
                ? "border-primary/50 bg-primary/20 text-primary"
                : "border-border/50 hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            Technical Interview
          </button>

          <button
            onClick={() => setMode("hr")}
            className={`px-6 py-3 rounded-lg font-semibold border ${
              mode === "hr"
                ? "border-primary/50 bg-primary/20 text-primary"
                : "border-border/50 hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            HR Interview
          </button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chat Area */}
          <div className="lg:col-span-2">

            <Card className="p-6 h-[600px] flex flex-col">

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary to-accent"
                          : "bg-background border"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>

                      {msg.feedback && (
                        <InterviewFeedback feedback={msg.feedback} />
                      )}

                      <span className="text-xs opacity-70 block mt-2">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader size={16} className="animate-spin" />
                    AI Coach is thinking...
                  </div>
                )}

              </div>

              {/* Input */}
              <div className="flex gap-2">

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-2 rounded-lg border bg-background"
                  disabled={isLoading}
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={16} />
                </Button>

              </div>

            </Card>

          </div>

          {/* Sidebar */}
          {showMetrics && (
            <div className="space-y-4">

              <Card className="p-6">

                <div className="flex justify-between mb-4">
                  <h3 className="font-bold">Session Metrics</h3>

                  <button
                    onClick={() => setShowMetrics(false)}
                    className="text-muted-foreground"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm">Questions Asked</p>
                <p className="text-2xl font-bold">
                  {sessionMetrics.questionsAsked}
                </p>

                <p className="text-sm mt-4">Average Score</p>
                <p className="text-2xl font-bold">
                  {sessionMetrics.avgScore}%
                </p>

                <Button
                  className="w-full mt-6"
                  onClick={handleNewSession}
                >
                  <RotateCcw size={16} />
                  New Session
                </Button>

              </Card>

              {/* Tips */}
              <Card className="p-6">

                <div className="flex gap-2 mb-4">
                  <Zap size={18} />
                  <h3 className="font-bold">Pro Tips</h3>
                </div>

                <ul className="space-y-2 text-xs">
                  <li>• Think out loud while solving</li>
                  <li>• Clarify requirements first</li>
                  <li>• Mention your assumptions</li>
                  <li>• Discuss trade-offs</li>
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