"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { hrQuestions } from "@/lib/questions-data"
import { ChevronDown, MessageCircle, Play } from "lucide-react"

type HRCategory = "Intro" | "Strengths" | "Failures" | "STAR" | "Culture" | "Questions"

function HRPrepContent() {
  const [selectedCategory, setSelectedCategory] = useState<HRCategory>("Intro")
  const [expandedId, setExpandedId] = useState<string>("")
  const [notes, setNotes] = useState<{ [key: string]: string }>({})
  const [notesVisible, setNotesVisible] = useState<Set<string>>(new Set())

  const categories: { id: HRCategory; label: string; description: string }[] = [
    { id: "Intro", label: "Introduction", description: "Start strong with a compelling introduction" },
    { id: "Strengths", label: "Strengths", description: "Showcase your key skills and achievements" },
    { id: "Failures", label: "Failures & Learning", description: "Turn setbacks into growth stories" },
    { id: "STAR", label: "STAR Method", description: "Master behavioral question framework" },
    { id: "Culture", label: "Culture Fit", description: "Show alignment with company values" },
    { id: "Questions", label: "Your Questions", description: "Ask thoughtful questions back" },
  ]

  const categoryQuestions = hrQuestions.filter((q) => q.category === selectedCategory)

  const toggleNotesVisible = (id: string) => {
    const newVisible = new Set(notesVisible)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setNotesVisible(newVisible)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">HR Interview Prep</h1>
          <p className="text-foreground/60">
            Master behavioral questions with expert tips, sample answers, and practice strategies
          </p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setExpandedId("")
              }}
              className={`p-4 rounded-lg text-left transition-all border ${
                selectedCategory === cat.id
                  ? "border-primary/50 bg-gradient-to-br from-primary/20 to-accent/10"
                  : "border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/60"
              }`}
            >
              <h3
                className={`font-bold text-sm mb-1 ${selectedCategory === cat.id ? "text-primary" : "text-foreground"}`}
              >
                {cat.label}
              </h3>
              <p className="text-xs text-foreground/60">{cat.description}</p>
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {categoryQuestions.map((question) => (
            <Card
              key={question.id}
              className="border-border/50 bg-card/50 overflow-hidden hover:border-primary/40 transition-all"
            >
              <button
                onClick={() => setExpandedId(expandedId === question.id ? "" : question.id)}
                className="w-full text-left flex items-start justify-between gap-4 p-6 hover:bg-primary/5 transition-colors"
              >
                <h3 className="text-lg font-bold flex-1 group-hover:text-primary">{question.question}</h3>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform text-primary ${expandedId === question.id ? "rotate-180" : ""}`}
                />
              </button>

              {expandedId === question.id && (
                <div className="p-6 border-t border-border/30 space-y-6 bg-background/20">
                  {/* Sample Answer */}
                  <div>
                    <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">Sample Answer</h4>
                    <div className="bg-background/50 border border-border/30 rounded-lg p-4">
                      <p className="text-foreground/80 text-sm leading-relaxed">{question.sampleAnswer}</p>
                    </div>
                  </div>

                  {/* Key Tips */}
                  <div>
                    <h4 className="font-bold text-sm text-primary mb-3">Key Tips</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.tips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 bg-background/50 border border-border/30 rounded-lg"
                        >
                          <span className="text-primary font-bold text-lg leading-none mt-0.5">✓</span>
                          <span className="text-sm text-foreground/80">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <button
                      onClick={() => toggleNotesVisible(question.id)}
                      className="flex items-center gap-2 font-semibold text-sm text-primary mb-2 hover:text-accent transition-colors"
                    >
                      <MessageCircle size={16} />
                      {notesVisible.has(question.id) ? "Hide" : "Add"} Personal Notes
                    </button>
                    {notesVisible.has(question.id) && (
                      <textarea
                        value={notes[question.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [question.id]: e.target.value })}
                        placeholder="Write your own answer or key points to remember..."
                        className="w-full px-4 py-3 text-sm bg-background/50 border border-border/30 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
                        rows={4}
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 flex items-center gap-2">
                      <Play size={16} />
                      Practice Answering
                    </Button>
                    <Button variant="outline" className="border-border/50 hover:bg-primary/10 bg-transparent">
                      Similar Questions
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Footer Tip */}
        <Card className="mt-8 p-6 border-primary/30 bg-primary/10 border-2">
          <p className="text-sm text-foreground/80">
            <span className="font-bold text-primary">Pro Tip:</span> Practice these questions out loud! Record yourself
            and watch for filler words, pacing, and clarity. The more you rehearse, the more natural your answers will
            sound in the actual interview.
          </p>
        </Card>
      </div>
    </main>
  )
}

export default function HRPrepPage() {
  return (
    <ProtectedRoute>
      <HRPrepContent />
    </ProtectedRoute>
  )
}
