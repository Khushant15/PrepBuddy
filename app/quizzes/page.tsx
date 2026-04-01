"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { 
  BookOpen, 
  Clock, 
  Star, 
  Filter, 
  Search, 
  Loader, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  LayoutGrid
} from "lucide-react"
import { toast } from "sonner"

type Quiz = {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration: number
  questionCount: number
}

const CATEGORIES = ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "Cloud", "Frontend", "Backend", "System Design"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]

export default function QuizzesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="pt-24 text-center font-black animate-pulse uppercase tracking-widest text-primary/40">Loading Practice Engine...</div>}>
        <QuizzesContent />
      </Suspense>
    </ProtectedRoute>
  )
}

function QuizzesContent() {
  const searchParams = useSearchParams()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("JavaScript")
  const [difficulty, setDifficulty] = useState("Medium")

  // 1. Handle deep-linked topics from Jobs Hub
  useEffect(() => {
    const topicParam = searchParams.get("topic")
    if (topicParam) {
        // Find closest match in CATEGORIES or just set it
        setCategory(topicParam)
    }
    const diffParam = searchParams.get("difficulty")
    if (diffParam) setDifficulty(diffParam)
  }, [searchParams])

  const fetchDynamicQuizzes = async () => {
    setLoading(true)
    try {
      const idToken = await auth?.currentUser?.getIdToken()
      // Easy: 30, Medium: 20, Hard: 20
      const limit = difficulty === "Easy" ? 30 : 20;
      const res = await fetch(`/api/quizzes?category=${category}&difficulty=${difficulty}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${idToken}`
        }
      })
      const data = await res.json()
      
      if (data.error) throw new Error(data.error)

      const targetCount = difficulty === "Easy" ? 30 : 20;
      const packs = [
        {
          id: `dynamic-${category}-${difficulty}-1`,
          title: `${category} Challenge: ${difficulty}`,
          description: `Test your ${category} skills with these real-time generated questions.`,
          topic: category,
          difficulty: difficulty,
          duration: 25,
          questionCount: data.length || targetCount
        },
        {
            id: `dynamic-${category}-${difficulty}-2`,
            title: `Advanced ${category} Scenarios`,
            description: `Deep dive into complex ${category} problem solving and edge cases.`,
            topic: category,
            difficulty: difficulty,
            duration: 25,
            questionCount: Math.min(data.length, 20)
        }
      ]
      setQuizzes(packs)
    } catch (err) {
      toast.error("Failed to fetch live Quiz data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDynamicQuizzes()
  }, [category, difficulty])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 pt-24 pb-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="pl-1">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Zap size={15} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 whitespace-nowrap">Smart Assessments Active</span>
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic tracking-tighter">
                    Practice Assessments
                </h1>
                <p className="text-muted-foreground mt-2 font-medium italic opacity-70 transition-opacity group-hover:opacity-100">Live questions powered by QuizAPI.io clusters.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-2 rounded-2xl border border-primary/10 shadow-xl">
                <div className="flex items-center gap-2 px-3 border-r border-primary/10 mr-1">
                    <Filter className="text-primary" size={16} />
                    <span className="text-xs font-black uppercase text-muted-foreground">Filters</span>
                </div>
                
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-sm px-2 cursor-pointer hover:text-primary transition-colors"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-sm px-2 cursor-pointer hover:text-primary transition-colors"
                >
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <Button 
                    size="sm" 
                    className="rounded-xl h-9 px-6 shadow-lg shadow-primary/20"
                    onClick={fetchDynamicQuizzes}
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin" size={16} /> : "REFRESH"}
                </Button>
            </div>
        </div>

        {loading && (
            <div className="h-[400px] flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-black text-primary uppercase tracking-[0.2em]">Synchronizing API Data...</p>
            </div>
        )}

        {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {quizzes.map(quiz => (
                    <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                        <Card className="p-8 border-2 border-primary/5 hover:border-primary transition-all bg-card/50 hover:shadow-2xl hover:shadow-primary/10 group cursor-pointer h-full flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all group-hover:scale-110">
                                <LayoutGrid size={100} />
                            </div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                                    {quiz.difficulty}
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-lg">
                                    <BookOpen size={20} />
                                </div>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h3 className="font-black text-xl mb-3 tracking-tight group-hover:text-primary transition-colors">
                                    {quiz.title}
                                </h3>
                                <p className="text-sm text-foreground/70 mb-8 font-medium leading-relaxed">
                                    {quiz.description}
                                </p>
                            </div>

                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground pt-6 border-t border-primary/5 relative z-10">
                                <div className="flex gap-2 items-center">
                                    <Clock size={16} className="text-primary" />
                                    {quiz.duration} MIN
                                </div>

                                <div className="flex gap-2 items-center">
                                    <Star size={16} className="text-yellow-500" />
                                    {quiz.questionCount} Qs
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        )}

        {!loading && quizzes.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-primary/10 rounded-3xl">
                <AlertCircle className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-xl font-bold">No dynamic quiz packs available for {category}.</h3>
                <p className="text-muted-foreground">Select another category to continue your prep.</p>
            </div>
        )}
      </div>
    </main>
  )
}