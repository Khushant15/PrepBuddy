"use client"

import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react"

interface QuizAttempt {
  id: string
  date: string
  score: number
  percentage: number
  timeSpent: number
  difficulty: "Easy" | "Medium" | "Hard"
}

const attemptHistory: QuizAttempt[] = [
  { id: "1", date: "Today", score: 9, percentage: 90, timeSpent: 12, difficulty: "Medium" },
  { id: "2", date: "Yesterday", score: 8, percentage: 80, timeSpent: 14, difficulty: "Medium" },
  { id: "3", date: "2 days ago", score: 10, percentage: 100, timeSpent: 11, difficulty: "Easy" },
  { id: "4", date: "3 days ago", score: 7, percentage: 70, timeSpent: 15, difficulty: "Hard" },
]

export function QuizAnalytics() {
  const avgScore = Math.round(attemptHistory.reduce((sum, a) => sum + a.percentage, 0) / attemptHistory.length)
  const bestScore = Math.max(...attemptHistory.map((a) => a.percentage))
  const totalTime = attemptHistory.reduce((sum, a) => sum + a.timeSpent, 0)

  return (
    <Card className="p-6 border-border/50 bg-card/50">
      <h2 className="text-xl font-bold mb-6">Quiz Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-primary" />
            <span className="text-xs text-foreground/70">Average Score</span>
          </div>
          <p className="text-2xl font-bold text-primary">{avgScore}%</p>
        </div>
        <div className="p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-accent" />
            <span className="text-xs text-foreground/70">Best Score</span>
          </div>
          <p className="text-2xl font-bold text-accent">{bestScore}%</p>
        </div>
        <div className="p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-primary" />
            <span className="text-xs text-foreground/70">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-primary">{totalTime} min</p>
        </div>
        <div className="p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-accent" />
            <span className="text-xs text-foreground/70">Attempts</span>
          </div>
          <p className="text-2xl font-bold text-accent">{attemptHistory.length}</p>
        </div>
      </div>

      {/* Attempt History */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Recent Attempts</h3>
        <div className="space-y-2">
          {attemptHistory.map((attempt) => (
            <div
              key={attempt.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{attempt.date}</p>
                <p className="text-xs text-foreground/60">
                  {attempt.difficulty} • {attempt.timeSpent} min
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{attempt.percentage}%</p>
                <p className="text-xs text-foreground/60">{attempt.score}/10</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
