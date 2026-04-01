"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Briefcase, Brain, BookOpen, Zap, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getRoadmapHistory } from "@/lib/progress-service"

interface Task {
  id: string
  title: string
  description: string
  type: "quiz" | "company" | "hr" | "resource" | "topic"
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  xpReward: number
  route: string
}

const getTypeIcon = (type: Task["type"]) => {
  switch (type) {
    case "quiz": return Code
    case "company": return Briefcase
    case "hr": return Brain
    case "resource": return BookOpen
    case "topic": return Zap
    default: return Code
  }
}

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    case "Medium": return "text-amber-400 border-amber-500/30 bg-amber-500/10"
    case "Hard": return "text-rose-400 border-rose-500/30 bg-rose-500/10"
    default: return "text-muted-foreground"
  }
}

export function SuggestedTasks() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      const roadmaps = await getRoadmapHistory()
      
      if (roadmaps.length > 0) {
        // Find an in-progress milestone from the first active roadmap
        const active = roadmaps[0] as any
        const nextStage = (active.completedStages?.length || 0) + 1
        
        setTasks([
            {
                id: "roadmap-next",
                title: `Mastery: ${active.id.split('-').slice(1).join(' ')}`,
                description: `Complete Milestone #${nextStage} in your active learning path.`,
                type: "topic",
                difficulty: "Medium",
                estimatedTime: "30 min",
                xpReward: 100,
                route: "/roadmaps"
            },
            {
                id: "daily-quiz",
                title: "Algorithmic Calibration",
                description: "Calibrate your problem solving vectors with a random quiz.",
                type: "quiz",
                difficulty: "Hard",
                estimatedTime: "25 min",
                xpReward: 150,
                route: "/quizzes"
            }
        ])
      } else {
        // Fallback to defaults
        setTasks([
            {
                id: "1",
                title: "Initialize Skill Path",
                description: "Generate your first AI-powered roadmap to begin mastery.",
                type: "topic",
                difficulty: "Easy",
                estimatedTime: "5 min",
                xpReward: 50,
                route: "/roadmaps"
            },
            {
                id: "2",
                title: "Baseline Assessment",
                description: "Complete a general technical quiz to establish your skill baseline.",
                type: "quiz",
                difficulty: "Medium",
                estimatedTime: "25 min",
                xpReward: 100,
                route: "/quizzes"
            }
        ])
      }
      setLoading(false)
    }
    loadTasks()
  }, [])

  return (
    <Card className="p-8 border-2 border-primary/10 bg-card/40 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 p-12 rotate-45 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Zap size={150} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-xl font-black italic tracking-tighter">Daily Quests</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mastery Path</p>
            </div>
            <span className="text-[9px] font-black px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 animate-pulse uppercase tracking-widest">
                Dynamic Sync
            </span>
        </div>

        <div className="space-y-4">
            {tasks.map((task) => {
            const IconComponent = getTypeIcon(task.type)
            return (
                <div
                key={task.id}
                className="p-5 rounded-2xl bg-background/40 border border-primary/5 hover:border-primary/20 hover:bg-background/60 transition-all group/item flex items-start gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                        <IconComponent size={20} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-black italic text-sm text-foreground truncate">{task.title}</h3>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${getDifficultyColor(task.difficulty)}`}>
                                {task.difficulty}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-1 mb-4">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                <span>{task.estimatedTime}</span>
                                <span className="text-accent">+{task.xpReward} XP</span>
                            </div>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-3 rounded-lg text-primary hover:bg-primary hover:text-primary-foreground font-black text-[9px] uppercase tracking-widest transition-all"
                                onClick={() => router.push(task.route)}
                            >
                                Calibrate <ChevronRight size={10} className="ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )
            })}
        </div>
      </div>
    </Card>
  )
}
