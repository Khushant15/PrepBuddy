"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Bookmark, BookmarkCheck, MapPin, DollarSign, Briefcase, 
  Search, Loader, AlertCircle, Building2, ArrowUpRight, Zap,
  Upload, FileText, CheckCircle2, Sparkles, TrendingUp, Target
} from "lucide-react"
import { toast } from "sonner"
import { getResumeProfile, saveResumeProfile, saveJobMatches, getIntelligentMatches } from "@/lib/progress-service"

const userProfile = {
  skills: ["Python", "JavaScript", "React", "SQL", "AWS", "Node.js", "TypeScript"],
}

export default function JobsPage() {
  return (
    <ProtectedRoute>
      <JobsContent />
    </ProtectedRoute>
  )
}

function JobsContent() {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("India")
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [saved, setSaved] = useState<Set<string>>(new Set())
  
  // Intelligent Search State
  const [resumeProfile, setResumeProfile] = useState<any>(null)
  const [intelligentJobs, setIntelligentJobs] = useState<any[]>([])
  const [parsing, setParsing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [highRelevance, setHighRelevance] = useState(true)
  const [userTier, setUserTier] = useState<string>("Entry")
  const [primaryDomain, setPrimaryDomain] = useState<string>("")
  const [secondaryDomain, setSecondaryDomain] = useState<string>("")
  const [isServiceLimited, setIsServiceLimited] = useState(false)

  useEffect(() => {
    const loadData = async () => {
        // 1. Pre-load from Firestore for instant UI
        const [profile, matches] = await Promise.all([
            getResumeProfile(),
            getIntelligentMatches()
        ])
        
        if (profile) setResumeProfile(profile)
        if (matches?.length > 0) setIntelligentJobs(matches)

        // 2. Refresh matches in background if profile exists
        if (profile) {
            fetchIntelligentJobs(profile)
        }
    }
    loadData()
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const idToken = await auth?.currentUser?.getIdToken()
      const res = await fetch(
        `/api/jobs?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`,
        { headers: { Authorization: `Bearer ${idToken}` } }
      )
      const data = await res.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to load live jobs")
    } finally {
      setLoading(false)
    }
  }

  const fetchIntelligentJobs = async (profileToUse?: any) => {
    const targetProfile = profileToUse || resumeProfile
    if (!targetProfile) return

    setAnalyzing(true)
    try {
      const idToken = await auth?.currentUser?.getIdToken()
      const res = await fetch("/api/jobs/intelligent", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile: targetProfile })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const jobs = data.jobs || []
      setIntelligentJobs(jobs)
      setHighRelevance(data.high_relevance !== false)
      if (data.tier) setUserTier(data.tier)
      if (data.primary_domain) setPrimaryDomain(data.primary_domain)
      if (data.secondary_domain) setSecondaryDomain(data.secondary_domain)
      if (data.error_type === "OUT_OF_CREDITS") setIsServiceLimited(true)
      else setIsServiceLimited(false)
      
      if (jobs.length > 0) {
          await saveJobMatches(jobs) // Persist matches via client SDK
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Quality analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsing(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const idToken = await auth?.currentUser?.getIdToken()
      const res = await fetch("/api/resume/parse", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData
      })
      const result = await res.json()
      if (result.profile) {
          setResumeProfile(result.profile)
          await saveResumeProfile(result.profile) // Persist via client SDK
          toast.success("Resume Synced Successfully!")
          fetchIntelligentJobs(result.profile)
      }
    } catch {
      toast.error("Failed to parse resume")
    } finally {
      setParsing(false)
    }
  }


  const getMatchData = (title: string, desc: string = "") => {
    const text = (title + " " + desc).toLowerCase()
    const matched = userProfile.skills.filter(s => text.includes(s.toLowerCase()))
    const pct = Math.min(Math.round((matched.length / 5) * 100), 100)
    return { pct, matched, missing: userProfile.skills.filter(s => !matched.includes(s)).slice(0, 3) }
  }

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      toast.success(n.has(id) ? "Job saved" : "Removed from saved")
      return n
    })
  }

  const matchColor = (pct: number) =>
    pct >= 70 ? "text-emerald-400" : pct >= 40 ? "text-primary" : "text-rose-400"

  const matchStroke = (pct: number) =>
    pct >= 70 ? "#34d399" : pct >= 40 ? "hsl(var(--primary))" : "#f87171"

  // SVG ring — r=18, circumference ≈ 113
  const RingMatch = ({ pct, stroke }: { pct: number; stroke: string }) => {
    const C = 113
    const offset = C - (pct / 100) * C
    return (
      <div className="relative w-11 h-11 shrink-0">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="22" cy="22" r="18" fill="none"
            stroke={stroke} strokeWidth="3"
            strokeDasharray={C} strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black`} style={{ color: stroke }}>
          {pct}%
        </span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 pt-24 pb-16">

        {/* ── HEADER ROW ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">

          {/* Title */}
          <div className="pl-1">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary mb-1">
              ▸ Live Job Market
            </p>
            <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-white to-emerald-400 bg-clip-text text-transparent leading-none">
              Smart Jobs
            </h1>
          </div>

          {/* Search bar — pill with two fields + button */}
          <div className="flex items-center gap-0 bg-card/60 backdrop-blur-xl border-2 border-primary/15 rounded-[18px] p-1.5 w-full lg:max-w-[520px]">
            {/* Role field */}
            <div className="flex items-center gap-2 flex-1 px-4 py-2 border-r border-primary/10">
              <Briefcase size={14} className="text-primary/50 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-muted-foreground leading-none mb-0.5">Role</span>
                <input
                  className="bg-transparent border-none outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground/50 w-full"
                  placeholder="e.g. Frontend"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchJobs()}
                />
              </div>
            </div>
            {/* Location field */}
            <div className="flex items-center gap-2 flex-1 px-4 py-2">
              <MapPin size={14} className="text-primary/50 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-muted-foreground leading-none mb-0.5">Location</span>
                <input
                  className="bg-transparent border-none outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground/50 w-full"
                  placeholder="City or Remote"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchJobs()}
                />
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-[12px] px-5 h-10 font-black tracking-widest uppercase text-[11px] shrink-0 ml-1"
              onClick={fetchJobs}
              disabled={loading}
            >
              {loading
                ? <Loader size={14} className="animate-spin" />
                : <><Search size={14} className="mr-1.5" /> Search</>
              }
            </Button>
          </div>
        </div>

        {/* ── INTELLIGENT MATCHING SECTION ───────────────────── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
               <Sparkles size={20} />
             </div>
             <div>
              <h2 className="text-2xl font-black italic tracking-tighter">AI recommended for you</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Based on your uploaded professional matrix</p>
                {isServiceLimited && (
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in slide-in-from-left duration-500">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-black rounded-lg text-[9px] font-black uppercase tracking-tighter">
                      <AlertCircle size={10} /> Limited Mode
                    </span>
                    <p className="text-[10px] font-bold text-amber-500/80 italic">
                      Third-party API quota reached. Showing high-quality pre-analyzed fallback roles. 
                      <span className="ml-1 opacity-60 font-medium">(Trial credits are one-time; Subscriptions refresh monthly)</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!resumeProfile ? (
            <Card className="p-12 border-4 border-dashed border-primary/10 bg-primary/5 rounded-[3rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/20 transition-all relative overflow-hidden" onClick={() => document.getElementById("resume-upload")?.click()}>
               <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                 <Upload size={32} />
               </div>
               <h3 className="text-2xl font-black italic mb-2">Initialize Smart Match</h3>
               <p className="text-muted-foreground max-w-sm mb-8 text-sm font-medium">Upload your resume to unlock real-time suitabilty analysis and personalized career coaching.</p>
               <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
               <Button className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30">
                 {parsing ? <Loader className="animate-spin mr-2" /> : <FileText className="mr-2" />}
                 {parsing ? "Parsing Metadata..." : "Upload Resume (PDF)"}
               </Button>
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <Sparkles size={200} />
               </div>
            </Card>
          ) : (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-primary/5 p-6 rounded-[2rem] border border-primary/10 mb-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shrink-0">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none mb-1">Matrix Synced</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-black italic">{resumeProfile.role}</p>
                                {primaryDomain && (
                                    <span className="text-[9px] font-black px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full uppercase italic">
                                        {primaryDomain} / {secondaryDomain || "Engineering"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <input id="resume-upload-new" type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} />
                         <Button variant="outline" size="sm" className="rounded-xl border-primary/20 h-10 font-bold text-[10px] uppercase tracking-widest" onClick={() => document.getElementById("resume-upload-new")?.click()}>
                           {parsing ? <Loader size={12} className="animate-spin mr-2" /> : <Upload size={12} className="mr-2" />}
                           Update Resume
                         </Button>
                         <Button variant="ghost" size="sm" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10" onClick={() => fetchIntelligentJobs()}>
                           {analyzing ? <Loader size={12} className="animate-spin mr-2" /> : <Zap size={12} className="mr-2 fill-primary" />}
                           Refresh Matches
                         </Button>
                    </div>
                </div>

                {analyzing ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map(i => (
                        <Card key={i} className="p-8 border-2 border-primary/5 bg-card/20 animate-pulse rounded-[2.5rem] h-[280px]" />
                      ))}
                   </div>
                ) : intelligentJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {intelligentJobs.map(job => (
                            <IntelligentJobCard key={job.id} job={job} saved={saved} onToggleSave={toggleSave} tier={userTier} />
                        ))}
                    </div>
                ) : !highRelevance ? (
                    <Card className="p-10 border-2 border-primary/20 bg-primary/5 rounded-[3rem] text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Target size={32} />
                            </div>
                            <h3 className="text-2xl font-black italic mb-2 tracking-tight">Bridge the Career Gap</h3>
                            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm font-medium">
                                We've analyzed the market for <span className="text-primary font-black italic">{primaryDomain || resumeProfile.role}</span>. Bridge the skills gap with these actionable, entry-level steps:
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                {primaryDomain === "Frontend" ? ["React Hooks Mastery", "Tailwind Logic", "Responsive UI"].map(step => (
                                    <div key={step} className="px-5 py-3 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary italic">
                                        {step}
                                    </div>
                                )) : primaryDomain === "FullStack" ? ["JSON API Design", "SQL Optimization", "Auth Patterns"].map(step => (
                                    <div key={step} className="px-5 py-3 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary italic">
                                        {step}
                                    </div>
                                )) : ["Clean Code", "Git Flow", "Problem Solving"].map(step => (
                                    <div key={step} className="px-5 py-3 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary italic">
                                        {step}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 group/road" onClick={() => window.location.href='/roadmaps'}>
                                    Generate Expert Roadmap <ArrowUpRight className="ml-2 group-hover/road:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="ghost" className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[11px] text-primary hover:bg-primary/10" onClick={() => window.location.href='/quizzes'}>
                                    Validate Skills <Zap className="ml-2 fill-primary" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="py-12 text-center text-muted-foreground italic font-medium">
                        Looking for matches... Click refresh if none show up.
                    </div>
                )}
            </div>
          )}
        </section>

        {/* ── RESULTS BAR ────────────────────────────────────── */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
              <span className="text-primary">{jobs.length}</span> &nbsp;positions found
            </p>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
              <Zap size={9} /> Live Data
            </span>
          </div>
        )}

        {/* ── LOADING SKELETONS ────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-5 border-2 border-primary/5 bg-card/20 animate-pulse rounded-2xl h-[160px] flex flex-col justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-[14px] bg-primary/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-primary/20 rounded" />
                    <div className="h-5 w-48 bg-primary/10 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-16 bg-primary/5 rounded" />
                  <div className="h-4 w-24 bg-primary/5 rounded" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── EMPTY ───────────────────────────────────────────── */}
        {!loading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-primary/10 rounded-3xl bg-card/20">
            <AlertCircle size={48} className="text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-black mb-1">No positions found</h3>
            <p className="text-sm text-muted-foreground">Try different keywords or location.</p>
          </div>
        )}

        {/* ── JOB CARDS ───────────────────────────────────────── */}
        {!loading && (
          <div className="flex flex-col gap-3">
            {jobs.map(job => {
              const { pct, matched, missing } = getMatchData(job.job_title, job.job_description)
              const stroke = matchStroke(pct)
              const isSaved = saved.has(job.job_id)

              return (
                <Card
                  key={job.job_id}
                  className="p-5 border-2 border-primary/5 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-xl group"
                >
                  {/* ── TOP ROW: Logo + Info + Actions ── */}
                  <div className="flex items-start gap-3.5 mb-4">

                    {/* Logo */}
                    <div className="w-11 h-11 rounded-[14px] bg-muted/40 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-primary/20 transition-all">
                      {job.employer_logo
                        ? <img src={job.employer_logo} alt={job.employer_name} className="w-7 h-7 object-contain" />
                        : <Building2 size={18} className="text-primary/25" />
                      }
                    </div>

                    {/* Company + Title */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-0.5">
                        {job.employer_name}
                      </p>
                      <h3
                        className="text-[17px] font-extrabold leading-tight text-foreground group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => window.open(job.job_apply_link, "_blank")}
                      >
                        {job.job_title}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`rounded-xl w-9 h-9 border transition-colors ${isSaved ? "border-primary/30 text-primary" : "border-primary/10 text-muted-foreground hover:border-primary/20"}`}
                        onClick={() => toggleSave(job.job_id)}
                      >
                        {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-xl h-9 px-4 font-black tracking-wider uppercase text-[11px]"
                        onClick={() => window.open(job.job_apply_link, "_blank")}
                      >
                        Apply <ArrowUpRight size={13} className="ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* ── BADGES ROW ── */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <MetaBadge icon={<Briefcase size={10} />} text={job.job_employment_type} />
                    <MetaBadge icon={<MapPin size={10} />} text={`${job.job_city} · ${job.job_country}`} />
                    <MetaBadge icon={<DollarSign size={10} />} text="Industry Rate" />
                  </div>

                  {/* ── FOOTER: Match + Skills ── */}
                  <div className="flex items-center gap-4 pt-4 border-t border-primary/5">

                    {/* Ring match */}
                    <RingMatch pct={pct} stroke={stroke} />
                    <div className="shrink-0">
                      <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted-foreground leading-none mb-0.5">Match</p>
                      <p className="text-[11px] font-semibold text-muted-foreground">{matched.length} of {userProfile.skills.length} skills</p>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-9 bg-primary/8 shrink-0" />

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {matched.map(s => (
                        <span key={s} className="text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {s}
                        </span>
                      ))}
                      {missing.map(s => (
                        <span key={s} className="text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded-md bg-muted/20 text-muted-foreground/50 border border-primary/5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

      </div>
    </main>
  )
}

function MetaBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase text-muted-foreground bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1">
      {icon} {text}
    </span>
  )
}

// Component for Intelligent Match Display
function IntelligentJobCard({ job, saved, onToggleSave, tier }: any) {
    const isSaved = saved.has(job.id)
    const Ring = ({ pct }: { pct: number }) => {
        const C = 113
        const offset = C - (pct / 100) * C
        const stroke = pct >= 80 ? "#10b981" : pct >= 50 ? "hsl(var(--primary))" : "#f43f5e"
        return (
            <div className="relative w-14 h-14 shrink-0 shadow-2xl rounded-full">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle
                        cx="22" cy="22" r="18" fill="none"
                        stroke={stroke} strokeWidth="4"
                        strokeDasharray={C} strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: stroke }}>
                    {pct}%
                </span>
            </div>
        )
    }

    return (
        <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 rounded-[2.5rem] shadow-3xl hover:border-primary/40 transition-all group flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {job.logo ? <img src={job.logo} alt="" className="w-10 h-10 object-contain" /> : <Building2 size={24} className="text-primary/20" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{job.company}</p>
                                <span className="text-[8px] font-black px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-tighter">
                                    {tier} Level
                                </span>
                            </div>
                            <h4 className="text-xl font-black italic tracking-tight leading-none group-hover:text-primary transition-colors cursor-pointer" onClick={() => window.open(job.applyLink, "_blank")}>{job.title}</h4>
                        </div>
                    </div>
                    <Ring pct={job.score} />
                </div>

                <div className="bg-primary/5 rounded-2xl p-4 mb-6 border border-primary/10">
                    <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-2 flex items-center gap-1.5 italic">
                        <Sparkles size={10} className="fill-primary" /> Why you fit
                    </p>
                    <p className="text-xs font-bold leading-relaxed italic text-foreground/80">"{job.reason}"</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {job.strengths?.slice(0, 3).map((s: string) => (
                            <span key={s} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 size={10} /> {s}
                            </span>
                        ))}
                    </div>
                    {job.matched_project && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                            <Briefcase size={10} className="text-primary" />
                            <p className="text-[10px] font-bold text-primary italic">Matched via <span className="font-black uppercase">{job.matched_project}</span></p>
                        </div>
                    )}
                    {job.missing_skills?.length > 0 && (
                        <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black uppercase text-rose-400 tracking-widest italic">Gap detected</p>
                                <span className="text-[8px] font-bold opacity-40 uppercase">AI Confidence: {job.confidence || "Mid"}</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {job.missing_skills.slice(0, 3).map((s: string) => (
                                    <span key={s} className="px-3 py-1 bg-rose-500/5 text-rose-400/60 border border-rose-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                        {s}
                                    </span>
                                ))}
                             </div>
                        </div>
                    )}
                    {job.improvement_steps && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-primary/5">
                            <p className="text-[9px] font-black uppercase text-primary/60 tracking-widest italic">Growth Steps</p>
                            <ul className="space-y-1.5">
                                {job.improvement_steps.slice(0, 2).map((step: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-foreground/70 italic leading-snug">
                                        <TrendingUp size={10} className="mt-0.5 text-primary shrink-0" /> {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-primary/10 mt-auto">
                <Button className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-xl group/btn" onClick={() => window.open(job.applyLink, "_blank")}>
                    Secure Role <ArrowUpRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1 rounded-2xl h-12 border-primary/20 bg-primary/5 font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 group/imp"
                    onClick={() => {
                        const target = job.missing_skills?.[0] || job.title
                        window.location.href = `/roadmaps?topic=${encodeURIComponent(target)}&role=${encodeURIComponent(job.title)}`
                    }}
                >
                    Improve Path <Sparkles size={12} className="ml-2 fill-primary animate-pulse" />
                </Button>
                <Button 
                    variant="ghost" 
                    className="flex-1 rounded-2xl h-12 border-primary/10 bg-muted/5 font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 group/test shadow-inner"
                    onClick={() => {
                        const topSkill = job.missing_skills?.[0] || job.strengths?.[0] || "JavaScript"
                        window.location.href = `/quizzes?topic=${encodeURIComponent(topSkill)}`
                    }}
                >
                    Test Skills <Zap size={12} className="ml-2 fill-primary" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`rounded-2xl w-12 h-12 shrink-0 border transition-colors ${isSaved ? "border-primary/30 text-primary" : "border-primary/10 text-muted-foreground hover:border-primary/20"}`}
                    onClick={() => onToggleSave(job.id)}
                >
                    {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </Button>
            </div>
        </Card>
    )
}
