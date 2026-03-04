"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Briefcase, Brain, BookOpen, Zap } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  type: "quiz" | "company" | "hr" | "resource" | "topic"
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  xpReward: number
}

const suggestedTasks: Task[] = [
  {
    id: "1",
    title: "Master Graph Algorithms",
    description: "Complete the advanced graph problems quiz",
    type: "quiz",
    difficulty: "Hard",
    estimatedTime: "45 min",
    xpReward: 150,
  },
  {
    id: "2",
    title: "Google Interview Questions",
    description: "Practice 5 real Google SDE interview questions",
    type: "company",
    difficulty: "Hard",
    estimatedTime: "1 hour",
    xpReward: 200,
  },
  {
    id: "3",
    title: "System Design Basics",
    description: "Learn fundamental system design patterns",
    type: "topic",
    difficulty: "Medium",
    estimatedTime: "30 min",
    xpReward: 100,
  },
  {
    id: "4",
    title: "HR Interview Practice",
    description: "Practice STAR method for behavioral questions",
    type: "hr",
    difficulty: "Medium",
    estimatedTime: "25 min",
    xpReward: 75,
  },
]

const getTypeIcon = (type: Task["type"]) => {
  switch (type) {
    case "quiz":
      return Code
    case "company":
      return Briefcase
    case "hr":
      return Brain
    case "resource":
      return BookOpen
    case "topic":
      return Zap
    default:
      return Code
  }
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

export function SuggestedTasks() {
  return (
    <Card className="p-6 border-border/50 bg-card/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Suggested Tasks</h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent">Personalized</span>
      </div>

      <div className="space-y-3">
        {suggestedTasks.map((task) => {
          const IconComponent = getTypeIcon(task.type)
          return (
            <div
              key={task.id}
              className="p-4 rounded-lg bg-background/30 border border-border/30 hover:border-primary/40 hover:bg-background/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                  <IconComponent size={18} className="text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <p className="text-xs text-foreground/60">{task.description}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded border ${getDifficultyColor(task.difficulty)} whitespace-nowrap`}
                    >
                      {task.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-foreground/60 mb-3">
                    <span>Estimated: {task.estimatedTime}</span>
                    <span className="w-px h-4 bg-border/50"></span>
                    <span className="text-accent font-semibold">+{task.xpReward} XP</span>
                  </div>

                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-8">
                    Start Task
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-foreground/60 mt-4">
        Tasks are personalized based on your skill gaps and target role.
      </p>
    </Card>
  )
}
