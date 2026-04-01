"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Loader, 
  Target, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  Award
} from "lucide-react"
import ProgressBar from "@/components/progress-bar"
import { toast } from "sonner"
import { saveRoadmapProgress, getRoadmapProgress } from "@/lib/progress-service"

export default function RoadmapsPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [customRoadmap, setCustomRoadmap] = useState<any>(null)
  const [role, setRole] = useState("")
  const [completedStages, setCompletedStages] = useState<number[]>([])

  // 1. Handle deep-linked roles from Jobs Hub
  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam && !customRoadmap) {
        setRole(roleParam)
        const autoTrigger = async () => {
             // Small delay to ensure state is set
             await new Promise(r => setTimeout(r, 100))
             generateRoadmap(roleParam)
        }
        autoTrigger()
    }
  }, [searchParams])

  // Load progress when a roadmap is generated or exists
  useEffect(() => {
    if (customRoadmap?.id) {
       const loadProgress = async () => {
          const progress = await getRoadmapProgress(customRoadmap.id)
          setCompletedStages(progress)
       }
       loadProgress()
    }
  }, [customRoadmap])

  const generateRoadmap = async (targetRole?: string) => {
    const roleToUse = targetRole || role
    if (!roleToUse) return toast.error("Please enter a role first!")
    setLoading(true)
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      })
      const data = await res.json()
      // Generate a deterministic ID based on role for tracking
      const roadmapId = `roadmap-${roleToUse.toLowerCase().replace(/\s+/g, '-')}`
      setCustomRoadmap({ ...data, id: roadmapId, role: roleToUse })
    } catch (err) {
      toast.error("Failed to generate custom roadmap")
    } finally {
      setLoading(false)
    }
  }

  const toggleStage = async (index: number) => {
      if (!customRoadmap?.id) return
      
      const isCompleted = completedStages.includes(index)
      const newStages = isCompleted 
        ? completedStages.filter(i => i !== index)
        : [...completedStages, index]
      
      setCompletedStages(newStages)
      
      try {
          await saveRoadmapProgress(customRoadmap.id, index, !isCompleted)
          toast.success(isCompleted ? "Stage marked as in-progress" : "Stage mastered! +10 XP")
      } catch (err) {
          toast.error("Failed to sync progress")
      }
  }

  const progressPercentage = customRoadmap?.stages 
    ? Math.round((completedStages.length / customRoadmap.stages.length) * 100) 
    : 0

  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="pt-24 text-center font-black animate-pulse uppercase tracking-widest text-primary/40">Loading Mastery Engine...</div>}>
         <RoadmapContent 
            role={role} 
            setRole={setRole} 
            loading={loading} 
            generateRoadmap={generateRoadmap}
            customRoadmap={customRoadmap}
            completedStages={completedStages}
            toggleStage={toggleStage}
            progressPercentage={progressPercentage}
         />
      </Suspense>
    </ProtectedRoute>
  )
}

function RoadmapContent({ 
    role, 
    setRole, 
    loading, 
    generateRoadmap, 
    customRoadmap, 
    completedStages, 
    toggleStage, 
    progressPercentage 
}: any) {
  return (
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl text-foreground">
        <div className="mb-12">
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic tracking-tighter">AI Learning Paths</h1>
            <p className="text-muted-foreground mt-2 max-w-lg font-medium">Precision-built technical paths tailored to your career goals.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6 border-2 border-primary/10 bg-primary/5 rounded-3xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Target className="text-primary" size={18} />
                        Custom Generator
                    </h3>
                    <div className="space-y-4">
                        <input 
                            className="w-full bg-background border-2 border-primary/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-bold placeholder:text-muted-foreground/30"
                            placeholder="e.g. Frontend Architect"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
                        />
                         <Button 
                            className="w-full gap-2 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] h-12"
                            onClick={generateRoadmap}
                            disabled={loading}
                         >
                            {loading ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            Generate Path
                         </Button>
                    </div>
                </Card>

                {customRoadmap && (
                    <Card className="p-6 border-2 border-emerald-500/10 bg-emerald-500/5 rounded-3xl animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                <TrendingUp size={14} /> Mastery Rank
                            </h3>
                            <span className="text-xl font-black text-emerald-500">{progressPercentage}%</span>
                        </div>
                        <ProgressBar percentage={progressPercentage} />
                        <p className="text-[10px] text-muted-foreground font-bold mt-4 italic uppercase tracking-tighter text-center">
                            {completedStages.length} of {customRoadmap.stages.length} Milestones Synced
                        </p>
                    </Card>
                )}

                <Card className="p-6 border-2 border-primary/5 bg-muted/10 opacity-60 rounded-3xl border-dashed">
                   <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Industry standard paths</p>
                   <ul className="text-xs space-y-3 font-bold">
                      <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><ArrowRight size={12} className="text-primary" /> Full Stack Developer</li>
                      <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><ArrowRight size={12} className="text-primary" /> Data Scientist</li>
                      <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><ArrowRight size={12} className="text-primary" /> Cloud Architect</li>
                   </ul>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
                {!customRoadmap && !loading && (
                    <div className="h-[500px] border-4 border-dashed border-primary/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-8 bg-card/20 group">
                        <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles size={48} className="text-primary/20" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground/20 italic mb-2">Initialize Your Skill Path</h3>
                        <p className="text-sm text-muted-foreground/40 font-bold uppercase tracking-widest max-w-xs">AI roadmap generation is ready for your search.</p>
                    </div>
                )}

                {loading && (
                    <div className="h-[500px] flex flex-col items-center justify-center">
                        <div className="relative mb-8">
                            <Loader size={64} className="animate-spin text-primary opacity-20" />
                            <Sparkles size={32} className="absolute top-4 left-4 text-primary animate-pulse" />
                        </div>
                        <p className="font-black text-xl italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI is architecting your success...</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-2 animate-pulse font-mono">Synthesizing milestones // searching data</p>
                    </div>
                )}

                {customRoadmap && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                       <Card className="p-10 border-2 border-primary/10 shadow-3xl bg-gradient-to-br from-card to-primary/5 rounded-[3rem] relative overflow-hidden">
                          
                          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                             <Target size={300} />
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
                             <div>
                                <h2 className="text-5xl font-black tracking-tighter italic mb-2 leading-none">{customRoadmap.title}</h2>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        {customRoadmap.role} Excellence
                                    </span>
                                    <span className="text-muted-foreground font-black italic text-sm">Calibration Target: Industry Standard</span>
                                </div>
                             </div>
                             <div className="bg-background/40 backdrop-blur-xl px-6 py-4 rounded-3xl border-2 border-primary/10 shadow-xl">
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Estimated Velocity</p>
                                <p className="text-xl font-black text-primary italic">{customRoadmap.duration}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-12 relative z-10">
                             {customRoadmap.stages.map((stage: any, index: number) => {
                                const isCompleted = completedStages.includes(index)
                                return (
                                    <div key={stage.id || index} className="relative pl-16">
                                       {/* Connecting Line */}
                                       {index !== customRoadmap.stages.length - 1 && (
                                           <div className={`absolute left-[2.2rem] top-12 bottom-0 w-1 transition-colors duration-500 ${isCompleted ? 'bg-emerald-500/30' : 'bg-primary/10'}`} />
                                       )}
                                       
                                       {/* Action Toggle */}
                                       <button 
                                            onClick={() => toggleStage(index)}
                                            className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg group ${
                                                isCompleted 
                                                ? 'bg-emerald-500 text-white border-emerald-400 rotate-0' 
                                                : 'bg-card border-2 border-primary/20 text-primary/40 hover:border-primary hover:text-primary -rotate-12'
                                            }`}
                                       >
                                          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={20} className="group-hover:scale-110 transition-transform" />}
                                       </button>
                                       
                                       <div className={`p-8 border-2 rounded-[2rem] transition-all duration-500 overflow-hidden relative ${
                                           isCompleted 
                                           ? 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-none' 
                                           : 'bg-background/40 border-primary/5 hover:border-primary/20 backdrop-blur-md shadow-xl'
                                       }`}>
                                          <div className="flex justify-between items-start mb-6 gap-4">
                                              <div>
                                                <h4 className={`font-black text-2xl tracking-tight mb-2 italic transition-colors ${isCompleted ? 'text-emerald-500' : 'text-foreground'}`}>
                                                    {stage.title}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {stage.topics.map((t: string) => (
                                                        <span key={t} className="px-3 py-1 bg-muted/40 rounded-lg text-[9px] uppercase font-black tracking-widest text-muted-foreground border border-black/5">{t}</span>
                                                    ))}
                                                </div>
                                              </div>
                                              {isCompleted && (
                                                  <div className="flex items-center gap-2 text-emerald-500 font-black italic text-xs animate-in slide-in-from-right-4">
                                                      <Award size={16} /> MASTERED
                                                  </div>
                                              )}
                                          </div>

                                          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-primary/5">
                                              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {stage.duration}</span>
                                                  <span className="flex items-center gap-1.5"><Target size={14} className="text-accent" /> High impact zone</span>
                                              </div>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className={`h-9 px-6 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                                                    isCompleted 
                                                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                                                    : 'hover:bg-primary/10 text-primary'
                                                }`}
                                              >
                                                  Access Labs <ArrowRight size={14} className="ml-2" />
                                              </Button>
                                          </div>
                                       </div>
                                    </div>
                                )
                             })}
                          </div>
                       </Card>
                    </div>
                )}
            </div>
        </div>
      </div>
  )
}
