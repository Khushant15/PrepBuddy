"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { roadmaps } from "@/lib/roadmap-data"
import { Zap } from "lucide-react"
import { RoadmapStageCard } from "@/components/roadmap-stage-card"
import ProgressBar from "@/components/progress-bar"

function RoadmapsContent() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>(roadmaps[0].id)
  const [expandedStage, setExpandedStage] = useState<string>("")
  const [completedStages, setCompletedStages] = useState<Set<string>>(
    new Set(roadmaps[0].stages.filter((s) => s.completed).map((s) => s.id)),
  )

  const currentRoadmap = roadmaps.find((r) => r.id === selectedRoadmap)!
  const completionPercentage = Math.round((completedStages.size / currentRoadmap.stages.length) * 100)
  const nextIncompleteStage = currentRoadmap.stages.findIndex((s) => !completedStages.has(s.id))

  const toggleStageComplete = (stageId: string) => {
    const newCompleted = new Set(completedStages)
    if (newCompleted.has(stageId)) {
      newCompleted.delete(stageId)
    } else {
      newCompleted.add(stageId)
    }
    setCompletedStages(newCompleted)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Learning Roadmaps</h1>
          <p className="text-foreground/60">Follow structured paths tailored to your target role and company</p>
        </div>

        {/* Roadmap Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roadmaps.map((roadmap) => (
            <button
              key={roadmap.id}
              onClick={() => {
                setSelectedRoadmap(roadmap.id)
                setExpandedStage("")
                setCompletedStages(new Set(roadmap.stages.filter((s) => s.completed).map((s) => s.id)))
              }}
              className={`p-5 rounded-lg text-left transition-all border-2 ${
                selectedRoadmap === roadmap.id
                  ? "border-primary bg-gradient-to-br from-primary/20 to-accent/10"
                  : "border-border/50 hover:border-primary/40 bg-card/40 hover:bg-card/60"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{roadmap.role}</h3>
                  <p className="text-sm text-foreground/70">{roadmap.company}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-md whitespace-nowrap">
                  {roadmap.duration}
                </span>
              </div>
              <p className="text-xs text-foreground/60">{roadmap.stages.length} stages</p>
            </button>
          ))}
        </div>

        {/* Progress Card */}
        <Card className="p-6 border-primary/30 bg-gradient-to-r from-primary/15 to-accent/10 mb-8 border-2">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Progress</h2>
              <p className="text-sm text-foreground/70">
                {completedStages.size} of {currentRoadmap.stages.length} stages completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {completionPercentage}%
              </p>
            </div>
          </div>
          <ProgressBar percentage={completionPercentage} label="to complete roadmap" />

          {/* Timeline indicator */}
          {nextIncompleteStage >= 0 && (
            <div className="mt-4 p-3 bg-background/40 border border-border/30 rounded-lg">
              <p className="text-sm text-foreground/80">
                <span className="font-semibold text-primary">Next Step:</span>{" "}
                {currentRoadmap.stages[nextIncompleteStage].title} (
                {currentRoadmap.stages[nextIncompleteStage].duration})
              </p>
            </div>
          )}
        </Card>

        {/* Roadmap Timeline */}
        <div className="space-y-3">
          {currentRoadmap.stages.map((stage, idx) => (
            <RoadmapStageCard
              key={stage.id}
              stage={{
                ...stage,
                completed: completedStages.has(stage.id),
              }}
              stageNumber={idx + 1}
              totalStages={currentRoadmap.stages.length}
              expanded={expandedStage === stage.id}
              onToggle={() => setExpandedStage(expandedStage === stage.id ? "" : stage.id)}
              onComplete={() => toggleStageComplete(stage.id)}
            />
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 p-6 border-border/50 bg-card/50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            Quick Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">•</span>
              <span className="text-foreground/80">Spend more time on topics marked with current indicators</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">•</span>
              <span className="text-foreground/80">Review completed topics every week to reinforce learning</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">•</span>
              <span className="text-foreground/80">Use recommended resources for hands-on practice</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">•</span>
              <span className="text-foreground/80">Take mock interviews after completing system design stage</span>
            </li>
          </ul>
        </Card>
      </div>
    </main>
  )
}

export default function RoadmapsPage() {
  return (
    <ProtectedRoute>
      <RoadmapsContent />
    </ProtectedRoute>
  )
}
