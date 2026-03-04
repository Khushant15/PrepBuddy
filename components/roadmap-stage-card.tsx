"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, BookOpen, ChevronDown, Zap, Target } from "lucide-react"
import type { RoadmapStage } from "@/lib/roadmap-data"

interface RoadmapStageCardProps {
  stage: RoadmapStage
  stageNumber: number
  totalStages: number
  expanded: boolean
  onToggle: () => void
  onComplete: () => void
}

export function RoadmapStageCard({
  stage,
  stageNumber,
  totalStages,
  expanded,
  onToggle,
  onComplete,
}: RoadmapStageCardProps) {
  const isCurrentStage = !stage.completed && stageNumber === 1
  const isPastStage = stage.completed && stageNumber < totalStages

  return (
    <Card
      className={`border transition-all cursor-pointer overflow-hidden ${
        expanded
          ? "border-primary/50 bg-card/70"
          : isPastStage
            ? "border-border/30 opacity-70"
            : isCurrentStage
              ? "border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10"
              : "border-border/50"
      }`}
      onClick={onToggle}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            {stage.completed ? (
              <CheckCircle2 size={28} className="text-primary" />
            ) : (
              <Circle size={28} className={`${isCurrentStage ? "text-primary" : "text-foreground/30"}`} />
            )}
            <span className="text-xs font-bold text-foreground/60">
              {stageNumber}/{totalStages}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {stage.title}
                  {isCurrentStage && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                      <Zap size={12} />
                      Current
                    </span>
                  )}
                </h3>
                <p className="text-foreground/70 text-sm mt-1">{stage.description}</p>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 text-primary transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-foreground/60 mt-3">
              <span className="px-2 py-1 bg-background/50 rounded-md font-medium">{stage.duration}</span>
              <span>{stage.topics.length} topics</span>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-border/30 space-y-5">
            {/* Topics */}
            <div>
              <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <Target size={16} />
                Topics to Cover
              </h4>
              <div className="flex flex-wrap gap-2">
                {stage.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 text-xs bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 rounded-full text-foreground/90 font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <BookOpen size={16} />
                Recommended Resources
              </h4>
              <ul className="space-y-2">
                {stage.resources.map((resource, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-background/30 border border-border/30 rounded-lg text-sm text-foreground/80 hover:border-primary/40 hover:bg-background/50 transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button
              onClick={onComplete}
              className={`w-full ${
                stage.completed
                  ? "bg-primary/20 hover:bg-primary/30 text-primary"
                  : "bg-gradient-to-r from-primary to-accent hover:opacity-90"
              }`}
            >
              {stage.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
