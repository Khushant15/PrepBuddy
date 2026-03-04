"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { companyQuestions } from "@/lib/questions-data"
import { Bookmark, BookmarkCheck, ExternalLink, MessageCircle } from "lucide-react"
import { useState } from "react"

function CompanyQuestionsContent() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null)
  const [notes, setNotes] = useState<{ [key: string]: string }>({})

  const companies = ["all", ...new Set(companyQuestions.map((q) => q.company))].sort()
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const filtered = companyQuestions.filter(
    (q) =>
      (selectedCompany === "all" || q.company === selectedCompany) &&
      (selectedDifficulty === "all" || q.difficulty === selectedDifficulty),
  )

  const toggleBookmark = (id: string) => {
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id)
    } else {
      newBookmarked.add(id)
    }
    setBookmarked(newBookmarked)
  }

  const toggleReviewed = (id: string) => {
    const newReviewed = new Set(reviewed)
    if (newReviewed.has(id)) {
      newReviewed.delete(id)
    } else {
      newReviewed.add(id)
    }
    setReviewed(newReviewed)
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-foreground/10"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Company Interview Questions</h1>
          <p className="text-foreground/60">
            Practice with real questions from top tech companies. Filter, bookmark, and track your progress.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="text-sm font-medium mb-2 block">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors"
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company === "all" ? "All Companies" : company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === "all" ? "All Levels" : difficulty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select
              defaultValue="all"
              className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors"
            >
              <option value="all">All Questions</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="reviewed">Marked as Reviewed</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-6 text-sm text-foreground/60">
          Showing {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filtered.map((question) => (
            <Card
              key={question.id}
              className={`p-6 border transition-all group ${
                reviewed.has(question.id)
                  ? "border-primary/40 bg-card/60 opacity-75"
                  : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/70"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-md">
                      {question.company}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-md border ${getDifficultyColor(question.difficulty)}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded-md">
                      {question.role}
                    </span>
                    {reviewed.has(question.id) && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-md">
                        Reviewed
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-3">{question.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-background/50 border border-border/30 rounded-md text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleBookmark(question.id)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    title="Bookmark"
                  >
                    {bookmarked.has(question.id) ? (
                      <BookmarkCheck size={20} className="text-primary" />
                    ) : (
                      <Bookmark size={20} className="text-foreground/40 hover:text-foreground/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* Notes and Action Buttons */}
              <div className="border-t border-border/30 pt-4 space-y-3">
                {expandedNotes === question.id && (
                  <textarea
                    value={notes[question.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [question.id]: e.target.value })}
                    placeholder="Add your notes, approach, or hints here..."
                    className="w-full px-3 py-2 text-sm bg-background/50 border border-border/30 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
                    rows={3}
                  />
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border/50 hover:bg-primary/10 bg-transparent flex items-center gap-2"
                    onClick={() => setExpandedNotes(expandedNotes === question.id ? null : question.id)}
                  >
                    <MessageCircle size={16} />
                    {expandedNotes === question.id ? "Hide" : "Add"} Notes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border/50 hover:bg-primary/10 bg-transparent"
                    onClick={() => toggleReviewed(question.id)}
                  >
                    {reviewed.has(question.id) ? "Mark as Unreviewed" : "Mark as Reviewed"}
                  </Button>
                  <Button
                    size="sm"
                    className="ml-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 flex items-center gap-2"
                  >
                    View Solution
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-8 text-center border-border/50 bg-card/50">
            <p className="text-foreground/70">No questions match your filters. Try adjusting your selection.</p>
          </Card>
        )}
      </div>
    </main>
  )
}

export default function CompanyQuestionsPage() {
  return (
    <ProtectedRoute>
      <CompanyQuestionsContent />
    </ProtectedRoute>
  )
}
