"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Edit2, 
  Settings, 
  Bell, 
  User, 
  Mail, 
  ShieldCheck, 
  Zap, 
  Target,
  ChevronRight,
  LogOut,
  Camera,
  CheckCircle2,
  Trash2,
  Lock,
  Trophy,
  Loader,
  BrainCircuit,
  Activity
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ProfileMatchCard } from "@/components/profile-match-card"
import ProgressBar from "@/components/progress-bar"
import { toast } from "sonner"
import { updateFCMToken, getUserProgress } from "@/lib/progress-service"
import { messaging } from "@/lib/firebase"
import { getToken } from "firebase/messaging"

function ProfileContent() {
  const { user, logout } = useAuth()
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [loadingToken, setLoadingToken] = useState(false)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserProgress()
        setProgress(data)
      } catch (err) {
        console.error("Profile Load Error:", err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchProgress()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
    } catch (err) {
      toast.error("Logout failed")
    }
  }

  const enableNotifications = async () => {
    setLoadingToken(true)
    try {
        const m = await messaging()
        if (!m) throw new Error("Messaging not supported")
        
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
            const token = await getToken(m, { 
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            })
            if (token) {
                await updateFCMToken(token)
                setPushEnabled(true)
                toast.success("Push Notifications Enabled")
            }
        } else {
            toast.error("Permission denied")
        }
    } catch (err) {
        toast.error("Failed to register for push notifications")
        console.error(err)
    } finally {
        setLoadingToken(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse font-black uppercase text-[10px] tracking-widest">Synchronizing AI Profile...</p>
        </div>
      </div>
    )
  }

  const xp = progress?.xp || 0
  const level = progress?.level || 1
  const accuracy = progress?.totalAttempted > 0 
    ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100) 
    : 75 // Generic starting accuracy if no stats

  const skills = progress?.skills?.length > 0 ? progress.skills : ["React", "TypeScript", "System Design", "Cloud Infrastructure"]

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="container mx-auto max-w-6xl px-4 pt-24">
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Header Info */}
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-primary/40 relative overflow-hidden">
                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera size={24} />
                        </div>
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent italic tracking-tighter leading-tight">
                            User Console
                        </h1>
                        <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                            Level {level}
                        </div>
                    </div>
                    <p className="text-muted-foreground font-medium flex items-center gap-2 justify-center md:justify-start">
                        <Mail size={14} className="text-primary" /> {user?.email}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 italic">Validated Architect</span>
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/20">Elite Candidate Pool</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-2xl border-primary/20 hover:bg-primary/5 h-12 px-8 font-black text-[10px] uppercase tracking-widest shadow-xl" onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Secure Logout
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Account Settings */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-8 border-2 border-primary/10 bg-card/40 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 p-12 opacity-[0.03] pointer-events-none rotate-12">
                        <Settings size={150} />
                    </div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-2">
                        <Activity size={14} /> Preferences
                    </h3>
                    <div className="space-y-4">
                        <ProfileNav icon={<User size={16}/>} label="Personal Identity" active />
                        <ProfileNav icon={<Lock size={16}/>} label="Security Core" />
                        <Card className="p-5 bg-primary/5 border-2 border-primary/10 rounded-2xl">
                            <div className="flex items-center justify-between mb-4 text-[10px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2 text-primary">
                                    <Bell size={14} /> Notifications
                                </span>
                                <span className={pushEnabled ? "text-emerald-500" : "text-muted-foreground"}>
                                    {pushEnabled ? "Active" : "Disabled"}
                                </span>
                            </div>
                            <Button 
                                className="w-full text-[10px] font-black rounded-xl h-10 shadow-lg"
                                variant={pushEnabled ? "outline" : "default"}
                                onClick={enableNotifications}
                                disabled={loadingToken || pushEnabled}
                            >
                                {loadingToken ? <Loader className="animate-spin" size={14} /> : pushEnabled ? "Verified Status" : "Enable Push Alerts"}
                            </Button>
                        </Card>
                        <ProfileNav icon={<Zap size={16}/>} label="Elite Subscription" />
                    </div>
                </Card>

                <Card className="p-8 border-2 border-primary/10 bg-primary/5 rounded-[2rem] shadow-2xl relative">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary mb-4">Smart Maturity</h3>
                    <p className="text-xs text-muted-foreground mb-8 font-medium italic">Complete certifications and assessments to unlock top-tier job matches.</p>
                    <ProgressBar percentage={accuracy} label="Domain Mastering" />
                    <div className="mt-10 space-y-4">
                        <CompletionItem label="Solve 10 Technical Quizzes" xp={+50} current={progress?.quizzesCompleted || 0} total={10} />
                        <CompletionItem label="Complete Full Interview" xp={+100} current={progress?.totalAttempted > 0 ? 1 : 0} total={1} />
                        <CompletionItem label="Achieve 80% Accuracy" xp={+200} current={accuracy} total={80} />
                    </div>
                </Card>
            </div>

            {/* Right Column: Skill Map & Analytics */}
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 border-2 border-primary/10 bg-card/30 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-8 -right-8 p-8 opacity-[0.03] pointer-events-none">
                            <Target size={150} />
                        </div>
                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-2">
                            <BrainCircuit size={16} /> Skill Matrix
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill: string) => (
                                <span key={skill} className="px-5 py-2.5 bg-background/40 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-primary/5 flex items-center gap-2 group hover:border-primary/40 transition-all cursor-crosshair backdrop-blur-xl">
                                    <CheckCircle2 size={12} className="text-primary" />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <ProfileMatchCard 
                        jobTitle="Full Stack Architect"
                        matchPercentage={accuracy > 80 ? 95 : 78}
                        matchedSkills={skills.slice(0, 3)}
                        missingSkills={["System Design L3", "Cloud Native Scaling"]}
                    />
                </div>

                <Card className="overflow-hidden border-2 border-primary/10 shadow-3xl rounded-[3rem] relative bg-card/20 backdrop-blur-3xl group">
                    <div className="p-10 border-b-2 border-primary/5 flex items-center justify-between">
                        <div>
                            <h3 className="font-black text-3xl italic tracking-tighter mb-1">Performance Matrix</h3>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em]">Live Data Stream: Visualizing Real-Time Assessment Velocity</p>
                        </div>
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-xl group-hover:scale-110 transition-transform">
                            <Trophy size={28} />
                        </div>
                    </div>
                    <div className="p-12 h-72 flex flex-col items-center justify-center bg-muted/5 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                            <BrainCircuit size={400} className="absolute -bottom-20 -right-20 text-primary" />
                        </div>
                        <Zap size={56} className="text-primary animate-pulse mb-6" />
                        <div className="text-center">
                            <p className="text-3xl font-black italic tracking-tighter mb-2">{xp} TOTAL XP</p>
                            <p className="font-black uppercase tracking-[0.4em] text-[10px] text-muted-foreground/60">Global Platform Rank: #1,240</p>
                        </div>
                        <div className="mt-8 flex gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`w-3 h-10 rounded-full transition-all duration-1000 ${i <= level % 6 ? 'bg-primary' : 'bg-primary/10'}`} style={{ transitionDelay: `${i * 100}ms` }} />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </main>
  )
}

function ProfileNav({ icon, label, active }: any) {
    return (
        <button className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group border-2 ${
            active ? "bg-primary text-primary-foreground shadow-2xl border-primary" : "hover:bg-primary/5 text-muted-foreground border-transparent"
        }`}>
            <div className="flex items-center gap-4">
                <span className={active ? "text-primary-foreground" : "text-primary"}>{icon}</span>
                <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight size={16} className={active ? "opacity-100" : "opacity-0 group-hover:opacity-100 text-primary transition-all translate-x-0 group-hover:translate-x-1"} />
        </button>
    )
}

function CompletionItem({ label, xp, current, total }: any) {
    const isCompleted = current >= total
    return (
        <div className={`flex items-center justify-between text-[10px] font-black uppercase p-4 rounded-2xl border-2 transition-all ${
            isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-background/40 border-primary/5 hover:border-primary/20 cursor-pointer group shadow-lg'
        }`}>
            <div className="flex flex-col gap-1">
                <span className={`tracking-tight ${isCompleted ? '' : 'text-muted-foreground group-hover:text-foreground transition-colors'}`}>
                    {isCompleted && <CheckCircle2 size={12} className="inline mr-2" />} {label}
                </span>
                <span className="text-[8px] opacity-40">{current}/{total} Progress</span>
            </div>
            <span className={`font-black italic ${isCompleted ? 'opacity-100' : 'text-primary'}`}>+{xp} XP</span>
        </div>
    )
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}