"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { 
  Zap, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Star,
  Flame,
  CheckCircle2,
  Trophy,
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  Activity,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ProgressBar from "@/components/progress-bar"
import DailyTip from "@/components/daily-tip"
import { Leaderboard } from "@/components/leaderboard"
import { QuizAnalytics } from "@/components/quiz-analytics"
import { SuggestedTasks } from "@/components/suggested-tasks"
import { ResumeGapAnalyzer } from "@/components/resume-gap-analyzer"
import { 
  subscribeToUserProgress, 
  getGlobalRank, 
  getTotalLessonsCompleted,
  getQuizHistory,
  getActivityLogs
} from "@/lib/progress-service"
import { db, auth } from "@/lib/firebase"
import { collection, query, limit, getDocs, orderBy, onSnapshot } from "firebase/firestore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  Cell
} from "recharts"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [radarData, setRadarData] = useState<any[]>([])
  const [rank, setRank] = useState<number | string>("...")
  const [lessons, setLessons] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [rawHistory, setRawHistory] = useState<any[]>([])

  // Dynamic Radar Data derived from real user metrics
  const deriveRadarData = (historyDocs: any[]) => {
    const categories = ['JavaScript', 'Java', 'React', 'Python', 'SQL', 'System Design', 'Cloud']
    const stats: Record<string, { total: number, count: number }> = {}
    
    categories.forEach(cat => stats[cat] = { total: 0, count: 0 })
    
    historyDocs.forEach(doc => {
        const cat = categories.find(c => doc.quizId?.includes(c)) || 'JavaScript'
        if (stats[cat]) {
            stats[cat].total += doc.percentage || 0
            stats[cat].count += 1
        }
    })

    return categories.map(cat => ({
        subject: cat,
        A: stats[cat].count > 0 ? Math.round(stats[cat].total / stats[cat].count) : 0,
        fullMark: 100
    }))
  }

  useEffect(() => {
    if (!user || !db) return

    // Fetch Initial Analytics
    const loadAnalytics = async () => {
      try {
        const [rankVal, lessonVal, historyDocs, activityDocs] = await Promise.all([
          getGlobalRank(),
          getTotalLessonsCompleted(),
          getQuizHistory(),
          getActivityLogs(7)
        ])

        setRank(rankVal || "100+")
        setLessons(lessonVal)
        
        // Performance History Chart
        let hData = historyDocs.slice(0, 7).map((doc: any) => ({
            name: doc.completedAt?.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) || "New",
            score: doc.score,
            percentage: doc.percentage
        })).reverse()

        // Recharts AreaChart needs at least 2 points to draw an area line
        if (hData.length === 1) {
            hData = [{ name: 'Start', score: 0, percentage: 0 }, ...hData]
        }
        setHistory(hData)

        // Radar Data
        setRadarData(deriveRadarData(historyDocs))

        // Weekly Activity Chart
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const weeklyMap: Record<string, number> = {}
        days.forEach(d => weeklyMap[d] = 0)
        
        activityDocs.forEach((log: any) => {
            const dateObj = log.timestamp || new Date()
            const dayName = days[dateObj.getDay()]
            weeklyMap[dayName] += 1
        })
        
        setWeeklyData(days.map(d => ({ day: d, count: weeklyMap[d] })))
        setRawHistory(historyDocs)

      } catch (err) {
        console.error("Dashboard Analytics Error:", err)
      } finally {
        setLoading(false)
      }
    }

    // Real-time Profile Subscription
    const unsubscribe = subscribeToUserProgress((data) => {
      setProgress(data)
      loadAnalytics() // Re-fetch dependencies when progress changes
    })

    // No need to call loadAnalytics manually because subscribeToUserProgress fires immediately with current state
    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-[6px] border-primary/20 border-t-primary rounded-full animate-spin shadow-2xl" />
          <p className="text-muted-foreground animate-pulse font-black tracking-[0.4em] uppercase text-[10px]">Synchronizing Smart Core...</p>
        </div>
      </div>
    )
  }

  const name = user?.displayName || user?.email?.split("@")[0] || "Explorer"
  const xp = progress?.xp || 0
  const level = progress?.level || 1
  const accuracy = progress?.totalAttempted > 0 
    ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100) 
    : 75

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 pt-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-6 duration-700">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
               <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI-Sync Active // High Velocity</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent italic leading-[0.8]">
              {name.toUpperCase()}_
            </h1>
            <p className="text-muted-foreground mt-4 font-black italic text-sm uppercase tracking-widest">
              Platform Status: <span className="text-primary">Optimized for Elite Performance</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <Card className="bg-primary/5 border-2 border-primary/20 px-8 py-5 rounded-[2rem] flex items-center gap-5 shadow-3xl backdrop-blur-2xl hover:border-primary/40 transition-all cursor-crosshair">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl rotate-3">
                    <Flame size={28} className="animate-pulse" />
                </div>
                <div>
                    <span className="text-[9px] font-black uppercase text-muted-foreground/60 block tracking-widest">Active Streak</span>
                    <span className="text-3xl font-black text-primary italic leading-none">{progress?.streak || 0} DAYS</span>
                </div>
             </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            
            {/* Top Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatCard icon={<TrendingUp size={20}/>} label="Precision" value={`${accuracy}%`} color="text-emerald-400" />
               <StatCard icon={<Star size={20}/>} label="Global Rank" value={`#${rank}`} color="text-yellow-400" />
               <StatCard icon={<Trophy size={20}/>} label="Skill XP" value={xp} color="text-primary" />
               <StatCard icon={<Target size={20}/>} label="Lesson Count" value={lessons} color="text-accent" />
            </div>

            {/* Neural Map Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-2 border-primary/10 bg-card/40 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                               <BrainCircuit size={16} /> Skill Radar
                            </h3>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-primary/20 animate-pulse">Live</span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#333" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: '900' }} />
                                    <Radar
                                        name="Skills"
                                        dataKey="A"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.5}
                                        dot={{ r: 4, fill: '#8884d8' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                <ResumeGapAnalyzer accuracy={accuracy} />
            </div>

            {/* Performance History Chart */}
            <Card className="p-10 border-2 border-primary/10 bg-gradient-to-br from-card to-primary/5 rounded-[3rem] shadow-3xl relative overflow-hidden group">
               <div className="absolute -bottom-16 -right-16 p-20 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <Activity size={300} />
               </div>
               <div className="flex items-center justify-between mb-12 relative z-10">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
                        <BarChart3 className="text-primary" size={24} />
                        Performance Trajectory
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase mt-1 tracking-[0.3em]">Skill Assessment Mapping // 30-Day Velocity</p>
                  </div>
                  <Button variant="outline" className="rounded-xl border-primary/20 h-9 font-black text-[9px] uppercase tracking-widest hidden sm:flex" onClick={() => router.push("/quizzes")}>
                    Detailed Logs <ChevronRight size={12} className="ml-2" />
                  </Button>
               </div>
               <div className="h-72 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history.length > 1 ? history : [{ name: 'Start', score: 0 }, { name: 'N/A', score: 0 }]}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} fontWeight="black" />
                    <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} fontWeight="black" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #333', borderRadius: '16px', backdropFilter: 'blur(12px)' }} 
                        itemStyle={{ color: '#8884d8', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8884d8" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <QuizAnalytics attemptHistory={rawHistory} />
                <Leaderboard />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
             <Card className="p-10 border-2 border-primary/20 bg-primary/5 rounded-[3rem] relative overflow-hidden shadow-2xl group">
                <div className="absolute top-0 right-0 p-6 rotate-12 opacity-5 group-hover:scale-125 transition-transform duration-700">
                   <Target size={150} />
                </div>
                <h3 className="font-black text-xl italic mb-10 flex items-center gap-3">
                  <Flame className="text-orange-500 animate-pulse" size={24} />
                  Weekly Activity
                </h3>
                <div className="h-48 w-full mb-6">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                           {weeklyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fillOpacity={0.4 + (entry.count / 40)} />
                           ))}
                        </Bar>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#666', fontWeight: '900'}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
                <Button 
                    className="w-full rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] h-14 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                    onClick={() => router.push("/quizzes")}
                >
                    Boost Velocity
                </Button>
             </Card>

             <DailyTip />
             <SuggestedTasks />
             
             {/* Elite Status Card */}
             <Card className="p-8 border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[2.5rem] relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-xl border border-amber-500/20">
                        <Star size={24} className="fill-amber-500" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg italic leading-none">PREMIUM ACCESS</h4>
                        <p className="text-[9px] font-black uppercase text-amber-500/70 tracking-widest mt-1">Status: Lifetime Executive</p>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed italic border-t border-amber-500/10 pt-4">
                    "You have unlocked the full potential of the Smart Engine. Use the Command Palette (Cmd+K) to navigate at high velocity."
                </p>
             </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <Card className="p-6 bg-card/60 backdrop-blur-2xl border-2 border-primary/5 hover:border-primary/20 transition-all flex items-center gap-5 group rounded-[2rem] shadow-xl">
      <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ${color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner border border-white/5`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] text-muted-foreground/60 font-black uppercase tracking-[0.2em] leading-none mb-1">{label}</p>
        <p className="text-2xl font-black leading-none italic tracking-tighter">{value}</p>
      </div>
    </Card>
  )
}

function GoalItem({ label, progress, completed, color }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
        <span className={completed ? "text-emerald-500 flex items-center gap-2" : "text-muted-foreground"}>
          {completed && <CheckCircle2 size={14} />} {label}
        </span>
        <span className="text-primary italic">{progress}%</span>
      </div>
      <div className="h-2.5 w-full bg-muted/40 rounded-full overflow-hidden border border-white/5 shadow-inner p-[2px]">
        <div className={`h-full ${color} transition-all duration-[2000ms] shadow-lg rounded-full flex items-center justify-end px-1`} style={{ width: `${progress}%` }}>
            <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}