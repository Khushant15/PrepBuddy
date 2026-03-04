"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react"

interface FeedbackItem {
  type: "positive" | "improvement" | "tip"
  text: string
}

interface InterviewFeedbackProps {
  feedback: FeedbackItem[]
  overallScore?: number
}

export function InterviewFeedback({ feedback, overallScore }: InterviewFeedbackProps) {
  return (
    <Card className="p-4 space-y-3 border-border/50 bg-background/40">
      {overallScore && (
        <div className="mb-3 pb-3 border-b border-border/30">
          <p className="text-xs text-foreground/70 mb-2 font-semibold">Response Score</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-background/70 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  overallScore >= 80 ? "bg-green-500" : overallScore >= 60 ? "bg-yellow-500" : "bg-orange-500"
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <span className="text-sm font-bold">{overallScore}%</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {feedback.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            {item.type === "positive" && (
              <>
                <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-foreground/80">{item.text}</span>
              </>
            )}
            {item.type === "improvement" && (
              <>
                <AlertCircle size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-foreground/80">{item.text}</span>
              </>
            )}
            {item.type === "tip" && (
              <>
                <Lightbulb size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/80">{item.text}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
