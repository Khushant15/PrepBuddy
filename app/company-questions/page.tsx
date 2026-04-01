"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, Search, Briefcase, Sparkles, 
  Code2, Layout, BookOpen, UserCheck, 
  Zap, Bug, History, Bookmark, BookmarkCheck,
  ChevronRight, Loader, Eye, EyeOff, Trophy, AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const categories = [
  { id: "Technical", icon: <Code2 size={18} />, label: "Technical (DSA)" },
  { id: "System Design", icon: <Layout size={18} />, label: "System Design" },
  { id: "Role-Based", icon: <Sparkles size={18} />, label: "Role-Based" },
  { id: "Conceptual", icon: <BookOpen size={18} />, label: "Conceptual" },
  { id: "HR / Behavioral", icon: <UserCheck size={18} />, label: "HR / Behavioral" },
  { id: "Rapid Fire MCQs", icon: <Zap size={18} />, label: "Rapid MCQs" },
  { id: "Debugging", icon: <Bug size={18} />, label: "Debugging" },
  { id: "Interview Experiences", icon: <History size={18} />, label: "Loop History" }
]

const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "AI/ML Engineer", "Data Scientist", "DevOps Engineer", "Product Manager", "Project Manager", "UX Designer"]
const quickSelect = ["TCS", "Accenture", "Cisco", "Flipkart", "Deloitte", "Cognizant", "Wipro", "Capgemini", "Google", "Amazon"]

export default function CompanyQuestionsPage() {
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [activeCategory, setActiveCategory] = useState("Technical")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showAnswerFor, setShowAnswerFor] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("prepbuddy_saved_questions")
    if (saved) setSavedIds(new Set(JSON.parse(saved)))
  }, [])

  const toggleBookmark = (id: string) => {
    setSavedIds(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        localStorage.setItem("prepbuddy_saved_questions", JSON.stringify(Array.from(next)))
        toast.success(next.has(id) ? "Bookmarked!" : "Removed Bookmark")
        return next
    })
  }

  const fetchDatabase = async (overrideCompany?: string) => {
    const targetCompany = overrideCompany || company
    if (!targetCompany) return toast.error("Please enter a company name!")
    
    setLoading(true)
    try {
      const res = await fetch("/api/company-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: targetCompany, role })
      })
      const result = await res.json()
      setData(result)
      toast.success(`Generated database for ${targetCompany} as ${role}`)
    } catch (err) {
      toast.error("Failed to load company questions.")
    } finally {
      setLoading(false)
    }
  }

  const currentQuestions = data?.[activeCategory] || []

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* ── HEADER OVERHAUL ─────────────────────────────────── */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                  <Trophy size={16} className="text-primary" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Elite Labs</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter italic bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent leading-none">
                Company Databases <span className="text-primary not-italic tracking-normal">2.0</span>
              </h1>
              <p className="text-muted-foreground mt-4 text-lg font-medium max-w-xl">
                The most advanced interview question bank engine. Tailored for <span className="text-primary font-bold">techies at any firm</span>.
              </p>
            </div>

            {/* Selectors Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-card/60 backdrop-blur-2xl p-2 rounded-[24px] border-2 border-primary/10 shadow-2xl w-full xl:max-w-2xl">
              <div className="flex flex-1 items-center gap-3 px-4 py-2 border-r border-primary/10">
                <Building2 size={18} className="text-primary/50" />
                <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Company</span>
                    <input 
                        className="bg-transparent border-none outline-none font-black text-sm text-foreground focus:ring-0 placeholder:text-muted-foreground/30"
                        placeholder="Search Company..."
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && fetchDatabase()}
                    />
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 px-4 py-2 border-r border-primary/10">
                <Briefcase size={18} className="text-primary/50" />
                <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Target Role</span>
                    <select 
                        className="bg-transparent border-none outline-none font-black text-sm text-foreground focus:ring-0 cursor-pointer appearance-none"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
              </div>
              <Button 
                className="rounded-[18px] px-8 h-12 font-black uppercase tracking-widest text-[11px] h-full"
                onClick={() => fetchDatabase()}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" size={16} /> : <><Sparkles size={14} className="mr-2" /> Initialize</>}
              </Button>
            </div>
          </div>

          {!data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-2">
                    {quickSelect.map(c => (
                        <Button 
                            key={c} variant="outline" size="sm" 
                            className="rounded-full text-[11px] font-bold border-primary/20 hover:border-primary px-6 h-10 transition-all hover:bg-primary/10"
                            onClick={() => { setCompany(c); fetchDatabase(c); }}
                        >
                            {c}
                        </Button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-8 border-2 border-primary/10 bg-card/40 flex flex-col items-center text-center">
                        <Code2 className="text-primary mb-4" size={32} />
                        <h3 className="text-xl font-black mb-2">Curated Systems</h3>
                        <p className="text-sm text-muted-foreground font-medium">Over 2,000+ hand-picked coding questions from major tech giants across India & US.</p>
                    </Card>
                    <Card className="p-8 border-2 border-accent/10 bg-card/40 flex flex-col items-center text-center">
                        <Zap className="text-accent mb-4" size={32} />
                        <h3 className="text-xl font-black mb-2">Real-Time AI</h3>
                        <p className="text-sm text-muted-foreground font-medium">Latest interview loop data from GFG, LeetCode, and Glassdoor synthesized instantly.</p>
                    </Card>
                    <Card className="p-8 border-2 border-emerald-500/10 bg-card/40 flex flex-col items-center text-center">
                        <UserCheck className="text-emerald-500 mb-4" size={32} />
                        <h3 className="text-xl font-black mb-2">HR & Behavioral</h3>
                        <p className="text-sm text-muted-foreground font-medium">Strategic guidance on how to answer company-specific behavioral and culture-fit questions.</p>
                    </Card>
                </div>
            </motion.div>
          )}

          {/* ── DASHBOARD LAYOUT ───────────────────────────────── */}
          {(data || loading) && (
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Category Sidebar */}
              <div className="w-full lg:w-72 shrink-0 flex items-start">
                <div className="sticky top-28 flex flex-col gap-1 w-full">
                  <p className="text-[9px] font-black tracking-[0.3em] uppercase text-muted-foreground mb-4 px-4 px-2">Expert modules</p>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                        activeCategory === cat.id 
                        ? "bg-primary text-primary-foreground shadow-2xl border-none" 
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <span className="text-[13px] font-black tracking-tight">{cat.label}</span>
                      </div>
                      <ChevronRight size={14} className={`transition-transform duration-300 ${activeCategory === cat.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  ))}

                  {/* Saved Filter */}
                  <button
                      onClick={() => setActiveCategory("Saved")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mt-6 ${
                        activeCategory === "Saved" 
                        ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                        : "text-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-500 border border-emerald-500/10"
                      }`}
                    >
                    <BookmarkCheck size={18} />
                    <span className="text-[13px] font-black tracking-tight">Saved Questions ({savedIds.size})</span>
                  </button>
                </div>
              </div>

              {/* Main Questions View */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <div className="flex flex-col gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-8 border-2 border-primary/5 bg-card/20 animate-pulse rounded-[2rem] h-[200px] flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="h-4 w-16 bg-primary/20 rounded-md" />
                                <div className="h-4 w-24 bg-primary/10 rounded-md" />
                            </div>
                            <div className="h-6 w-3/4 bg-primary/10 rounded-lg" />
                            <div className="h-3 w-1/2 bg-primary/5 rounded" />
                          </div>
                          <div className="flex justify-between items-center mt-6">
                             <div className="flex gap-2">
                                <div className="h-4 w-12 bg-primary/5 rounded" />
                                <div className="h-4 w-12 bg-primary/5 rounded" />
                             </div>
                             <div className="h-8 w-24 bg-primary/10 rounded-xl" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                        key={activeCategory} 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-4"
                    >
                      {currentQuestions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-primary/10 rounded-3xl bg-card/20 text-center">
                            <AlertCircle size={48} className="text-primary/20 mb-4" />
                            <h3 className="text-xl font-black">No questions in {activeCategory}</h3>
                            <p className="text-muted-foreground text-sm font-medium">Try another category or initialize a new role-based search.</p>
                        </div>
                      )}

                      {currentQuestions.map((q: any, i: number) => {
                        const questionId = `${company}-${activeCategory}-${i}`.replace(/\s+/g, '-').toLowerCase()
                        const isSaved = savedIds.has(questionId)
                        const isOpen = showAnswerFor === questionId

                        return (
                          <Card 
                            key={i} 
                            className={`group border-2 transition-all overflow-hidden ${
                                isOpen ? "border-primary/30 ring-4 ring-primary/5 bg-card/60 shadow-3xl" : "border-primary/5 hover:border-primary/20 bg-card/40 backdrop-blur-xl"
                            }`}
                          >
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                                            q.difficulty === 'Hard' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                            q.difficulty === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        }`}>
                                            {q.difficulty}
                                        </span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{activeCategory}</span>
                                    </div>
                                    <Button 
                                        size="icon" variant="ghost" 
                                        className={`rounded-xl transition-all ${isSaved ? "text-primary scale-110" : "text-muted-foreground/30 hover:text-primary"}`}
                                        onClick={() => toggleBookmark(questionId)}
                                    >
                                        {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                    </Button>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                                    {q.question}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium mb-6 line-clamp-3">
                                    {q.description}
                                </p>

                                <div className="flex items-center justify-between gap-4 pt-4 border-t border-primary/5">
                                    <div className="flex gap-2">
                                        {q.tags?.map((tag: string) => (
                                            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-primary px-2 py-1 bg-primary/5 rounded border border-primary/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Button 
                                        variant={isOpen ? "secondary" : "ghost"}
                                        size="sm" 
                                        className="rounded-xl h-9 px-4 font-black text-[11px] uppercase tracking-wider group"
                                        onClick={() => setShowAnswerFor(isOpen ? null : questionId)}
                                    >
                                        {isOpen ? <><EyeOff size={14} className="mr-2" /> Hide Solution</> : <><Eye size={14} className="mr-2" /> Reveal Answer</>}
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }} 
                                            animate={{ height: "auto", opacity: 1 }} 
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                                <p className="text-[9px] font-black uppercase text-primary tracking-[0.3em] mb-4">Interviewer's Ideal Answer</p>
                                                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                                    {q.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                          </Card>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  )
}