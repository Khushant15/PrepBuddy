"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface ProfileMatchProps {
  jobTitle: string
  matchPercentage: number
  matchedSkills: string[]
  missingSkills: string[]
}

export function ProfileMatchCard({ jobTitle, matchPercentage, matchedSkills, missingSkills }: ProfileMatchProps) {
  return (
    <Card className="p-4 border-border/50 bg-background/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Profile Match</h4>
          <span className={`text-lg font-bold ${matchPercentage >= 75 ? "text-green-500" : "text-yellow-500"}`}>
            {matchPercentage}%
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-background/70 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  matchPercentage >= 75 ? "bg-green-500" : matchPercentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>

          {matchPercentage >= 75 && (
            <div className="flex items-start gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
              <CheckCircle size={14} className="mt-0.5 shrink-0" />
              <span>Strong match! You have most required skills</span>
            </div>
          )}

          {matchPercentage < 75 && matchedSkills.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground/80">Your skills:</p>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.slice(0, 2).map((skill) => (
                  <span key={skill} className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground/80">Skills to learn:</p>
              <div className="flex flex-wrap gap-1">
                {missingSkills.slice(0, 2).map((skill) => (
                  <span key={skill} className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
