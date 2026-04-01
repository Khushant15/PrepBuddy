"use client"

import { useState, useEffect } from "react"
import { getQuizHistory } from "@/lib/progress-service"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react"

export function QuizAnalytics({ attemptHistory }: { attemptHistory: any[] }) {
  if (!attemptHistory) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Analytics...</div>

  const avgScore = attemptHistory.length > 0 
    ? Math.round(attemptHistory.reduce((sum, a) => sum + (a.percentage || 0), 0) / attemptHistory.length) 
    : 0
  const bestScore = attemptHistory.length > 0 
    ? Math.max(...attemptHistory.map((a) => a.percentage || 0)) 
    : 0
  const totalTime = attemptHistory.reduce((sum, a) => sum + (a.timeSpent || 15), 0) // Fallback to 15m if not recorded

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
          {attemptHistory.slice(0, 5).map((attempt, idx) => {
            const isDynamic = attempt.quizId?.startsWith("dynamic-");
            const parts = isDynamic ? attempt.quizId.split("-") : [];
            const category = isDynamic ? parts[1] : "Custom";
            const difficulty = isDynamic ? parts[2] : "Standard";
            const dateStr = attempt.completedAt 
              ? attempt.completedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : "Just now";

            return (
              <div
                key={attempt.id || idx}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{category} Quiz • {dateStr}</p>
                  <p className="text-xs text-foreground/60">
                    {difficulty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{attempt.percentage || 0}%</p>
                  <p className="text-xs text-foreground/60">{attempt.score || 0}/{attempt.total || 0}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
