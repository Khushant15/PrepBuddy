"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  percentage: number
  attempts: number
  badge?: "gold" | "silver" | "bronze"
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Chen", score: 98, percentage: 98, attempts: 5, badge: "gold" },
  { rank: 2, name: "Alex Johnson", score: 96, percentage: 96, attempts: 8, badge: "silver" },
  { rank: 3, name: "Jordan Smith", score: 95, percentage: 95, attempts: 6, badge: "bronze" },
  { rank: 4, name: "Taylor Brown", score: 93, percentage: 93, attempts: 10 },
  { rank: 5, name: "Casey Davis", score: 91, percentage: 91, attempts: 7 },
  { rank: 6, name: "Morgan Lee", score: 89, percentage: 89, attempts: 9 },
  { rank: 7, name: "Riley Wilson", score: 87, percentage: 87, attempts: 11 },
  { rank: 8, name: "Jamie Martinez", score: 85, percentage: 85, attempts: 12 },
]

const getBadgeIcon = (badge?: "gold" | "silver" | "bronze") => {
  switch (badge) {
    case "gold":
      return <Trophy size={18} className="text-yellow-500" />
    case "silver":
      return <Medal size={18} className="text-slate-400" />
    case "bronze":
      return <Medal size={18} className="text-orange-600" />
    default:
      return null
  }
}

export function Leaderboard() {
  return (
    <Card className="p-6 border-border/50 bg-card/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Global Leaderboard</h2>
        <div className="flex gap-1">
          {["This Week", "This Month", "All Time"].map((period) => (
            <button
              key={period}
              className="text-xs px-3 py-1 rounded border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {leaderboardData.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              entry.rank <= 3
                ? "bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30"
                : "bg-background/30 border border-border/30 hover:border-primary/40"
            }`}
          >
            {/* Rank */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-sm">
              {entry.badge ? getBadgeIcon(entry.badge) : `#${entry.rank}`}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{entry.name}</p>
              <p className="text-xs text-foreground/60">{entry.attempts} attempts</p>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <p className="font-bold text-primary">{entry.score}%</p>
              <p className="text-xs text-foreground/60">{entry.percentage}/100</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-foreground/60 mt-4 text-center">You are ranked #15 globally</p>
    </Card>
  )
}
