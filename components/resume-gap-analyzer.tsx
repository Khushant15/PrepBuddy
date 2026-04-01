"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Target, 
  BrainCircuit, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ResumeGapProps {
  resumeData?: any
  accuracy?: number
}

export function ResumeGapAnalyzer({ resumeData, accuracy = 0 }: ResumeGapProps) {
  const router = useRouter()

  // Mock logic to identify 'Gaps' based on resume vs standard SDE requirements
  const hasSystemDesign = resumeData?.experience?.some((e: any) => e.description.toLowerCase().includes("scalable") || e.description.toLowerCase().includes("architecture"))
  const hasTesting = resumeData?.experience?.some((e: any) => e.description.toLowerCase().includes("test") || e.description.toLowerCase().includes("jest"))
  
  const gaps = [
    { title: "System Architecture", impact: "High", present: hasSystemDesign, roadmap: "Frontend Architect" },
    { title: "Automated Testing", impact: "Medium", present: hasTesting, roadmap: "Full Stack Developer" },
    { title: "Distributed Systems", impact: "High", present: accuracy > 80, roadmap: "Backend Engineer" }
  ]

  return (
    <Card className="p-8 border-2 border-primary/10 bg-gradient-to-br from-card to-primary/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <BrainCircuit size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-2xl font-black italic tracking-tighter mb-1">Career Intelligence</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Gap Detection Active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-xl">
                <Target size={24} />
            </div>
        </div>

        <div className="space-y-6">
            {gaps.map((gap, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-primary/5 hover:border-primary/20 transition-all group/item">
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${gap.present ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {gap.present ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none mb-1">{gap.title}</p>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${gap.impact === 'High' ? 'text-accent' : 'text-muted-foreground'}`}>
                                Impact: {gap.impact}
                            </span>
                        </div>
                    </div>
                    {!gap.present && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground group/btn"
                            onClick={() => router.push("/roadmaps")}
                        >
                            Calibrate <ChevronRight size={12} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    )}
                </div>
            ))}
        </div>

        <div className="mt-8 pt-8 border-t border-primary/5 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 italic">
                {accuracy > 70 ? "Resume is 92% competitive for Elite firms." : "Analyze missing nodes to achieve 'Mastery' status."}
            </p>
            <Button 
                className="w-full rounded-2xl h-12 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20"
                onClick={() => router.push("/roadmaps")}
            >
                <Zap size={14} className="mr-2" /> Explore Custom Roadmaps
            </Button>
        </div>
      </div>
    </Card>
  )
}
