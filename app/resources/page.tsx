"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, Youtube, Newspaper, ExternalLink, Loader, Sparkles, Filter, 
  Star, Heart, FileText, Globe, Database, Layers, Cloud, Code2, Trophy
} from "lucide-react"
import { resources as staticResources } from "@/lib/roadmap-data"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

type ResourceCategory = "All" | "Practice" | "System Design" | "Learning" | "Reference"

const leetcodeSheet = "https://docs.google.com/document/d/1s_uWkiq50zWzGtlfpAMjnoqqwWRh_wHl3Vlkl1iyMQ4/edit"

const placementMaterials = [
  { title: "Data Structures & Algorithms", desc: "Complete DSA notes, coding problems and interview preparation.", link: "https://drive.google.com/drive/folders/1Ay5CmkoRJ5eEGcFskULc3CHNQn5iCVs3", icon: <Code2 className="text-blue-400" /> },
  { title: "Technical Fundamentals", desc: "Advanced Domain Internals, Networking and Systems concepts.", link: "https://drive.google.com/drive/u/0/folders/18FBvExqEtt9mtNKKP65f_ETdtS7nCG1G", icon: <Layers className="text-emerald-400" /> },
  { title: "Aptitude Preparation", desc: "Quantitative aptitude, logical reasoning and verbal ability materials.", link: "https://drive.google.com/drive/folders/1XmI6Iq_0MXJ6vq6Nkk-DcBK_y_LWNLCM", icon: <Trophy className="text-amber-400" /> },
  { title: "Off-Campus Materials", desc: "Preparation guides and strategies for off-campus recruitment drives.", link: "https://drive.google.com/drive/u/0/folders/1iKiq-ZbI3dTN0igO8xRnyaWJF_RCf2Ym", icon: <Globe className="text-sky-400" /> },
  { title: "Company Questions", desc: "Interview questions from TCS, Wipro, Accenture, Infosys and other recruiters.", link: "https://drive.google.com/drive/folders/1V5-NWPj1JhfBBf6wpU4rV7Ebar2ShSi5", icon: <Database className="text-rose-400" /> },
  { title: "Advanced DSA", desc: "Advanced algorithmic problems and optimization techniques.", link: "https://drive.google.com/drive/folders/1Da_v5uHIvBscWcRRgMsYGq-hJ00dQL9Y", icon: <Sparkles className="text-primary" /> },
  { title: "DBMS Mastery", desc: "SQL queries, database design and normalization concepts.", link: "https://drive.google.com/drive/folders/1f5dmqV84E-BN1PiVWqUhNXzcVWkCbGPa", icon: <Database className="text-cyan-400" /> },
  { title: "Cloud Computing", desc: "Cloud fundamentals and backend developer interview topics.", link: "https://drive.google.com/drive/folders/1_iB9UnsVlOWvdjKVmtC7b8b26L2ORdVR", icon: <Cloud className="text-indigo-400" /> },
]

function ResourcesContent() {
  const router = useRouter()
  const [query, setQuery] = useState("Professional Interview Preparation")
  const [loading, setLoading] = useState(false)
  const [liveData, setLiveData] = useState<{ youtube: any[], articles: any[] }>({ youtube: [], articles: [] })
  
  // Static Resources State
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>("All")
  const [favorited, setFavorited] = useState<Set<string>>(new Set())

  const fetchResources = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/resources?query=${encodeURIComponent(query)}`)
      const results = await res.json()
      setLiveData(results)
    } catch (err) {
      toast.error("Failed to load live studio data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
    // Load favorites from local storage if needed
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorited(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const categories: ResourceCategory[] = ["All", "Practice", "System Design", "Learning", "Reference"]

  const filteredStatic = selectedCategory === "All" 
    ? staticResources 
    : staticResources.filter(r => r.category === selectedCategory)

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ── HEADER & SEARCH ─────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-primary" />
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">Resource Hub 2.0</span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter italic bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent leading-none">
                    Studio <span className="not-italic text-white">X</span>
                </h1>
                <p className="text-muted-foreground mt-4 text-lg font-medium max-w-xl leading-relaxed">
                    Access curated drive materials, live YouTube tutorials, technical articles, and filterable interview roadmaps.
                </p>
            </div>

            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-2xl p-2 rounded-[24px] border-2 border-primary/10 shadow-2xl w-full lg:max-w-md">
                <Search className="text-primary ml-3" size={20} />
                <input 
                    className="flex-1 bg-transparent border-none outline-none font-bold text-sm px-2 focus:ring-0 placeholder:text-muted-foreground/30"
                    placeholder="Search Live Topics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchResources()}
                />
                <Button 
                    size="icon" 
                    className="rounded-[18px] w-10 h-10 shadow-lg shadow-primary/20"
                    onClick={fetchResources}
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
                </Button>
            </div>
        </div>

        {/* ── TOP HIGHLIGHTS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <HighlightCard 
            title="LeetCode Interview Cheatsheet"
            desc="Curated coding roadmap helping you crack FAANG coding interviews. Includes time complexity and common patterns."
            btnText="Open Google doc [↗]"
            onClick={() => window.open(leetcodeSheet, "_blank")}
            gradient="from-blue-600/20 to-indigo-600/20"
          />
          <HighlightCard 
            title="Interview Important Considerations"
            desc="Deep dive into OS, DBMS, OOPS, and Networking fundamentals. Includes interactive MCQs and theory guides."
            btnText="Launch Theo-Lab [↗]"
            onClick={() => router.push("/resources/interview-notes")}
            gradient="from-emerald-600/20 to-teal-600/20"
            isPrimary
          />
        </div>

        {/* ── PLACEMENT MATERIALS ────────────────────────────── */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black flex items-center gap-3">
                  <Database size={28} className="text-primary" /> Placement Drive Access
              </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {placementMaterials.map((item, index) => (
              <Card key={index} className="p-6 border-2 border-primary/5 bg-card/40 backdrop-blur-xl hover:border-primary/20 transition-all group flex flex-col justify-between">
                <div>
                    <div className="mb-4 p-3 rounded-xl bg-card border border-primary/5 w-fit group-hover:scale-110 transition-transform">
                        {item.icon}
                    </div>
                    <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4 line-clamp-2">{item.desc}</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-[10px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 rounded-xl"
                    onClick={() => window.open(item.link, "_blank")}
                >
                    Access Drive <ExternalLink size={12} className="ml-1.5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* ── LIVE CONTENT STUDIO ────────────────────────────── */}
        <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* YouTube column */}
                <div className="space-y-8">
                    <h2 className="flex items-center gap-3 text-2xl font-black border-b-2 border-primary/10 pb-4">
                        <Youtube className="text-red-500" size={28} /> Video Tutorials
                    </h2>
                    {loading ? (
                        <div className="grid gap-4">
                            {[1,2,3].map(i => <div key={i} className="h-32 bg-card/40 rounded-2xl animate-pulse border border-primary/5" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {liveData.youtube?.map((item: any) => (
                                <Card key={item.id} className="p-0 overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-all group flex flex-col bg-card/40 backdrop-blur-xl h-full">
                                    <div className="aspect-video relative overflow-hidden flex-shrink-0">
                                        <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <Youtube size={48} />
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                        <h4 className="font-bold text-xs line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer" onClick={() => window.open(item.url, "_blank")}>
                                            {item.title}
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.source}</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5 hover:bg-primary/20" onClick={() => window.open(item.url, "_blank")}>
                                                <ExternalLink size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Articles column */}
                <div className="space-y-8">
                    <h2 className="flex items-center gap-3 text-2xl font-black border-b-2 border-primary/10 pb-4">
                        <Newspaper className="text-primary" size={28} /> Daily Dev Digest
                    </h2>
                    {loading ? (
                        <div className="grid gap-4">
                            {[1,2,3].map(i => <div key={i} className="h-32 bg-card/40 rounded-2xl animate-pulse border border-primary/5" />)}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {liveData.articles?.map((item: any) => (
                                <Card key={item.id} className="p-6 border-2 border-primary/5 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-xl flex flex-col justify-between group h-32">
                                    <h4 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-snug" onClick={() => window.open(item.url, "_blank")}>
                                        {item.title}
                                    </h4>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground/60">{item.source}</span>
                                        <Button variant="link" className="p-0 h-auto text-primary text-[10px] font-black group-hover:underline" onClick={() => window.open(item.url, "_blank")}>
                                            STUDY ARTICLE [↗]
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* ── STATIC RESOURCE GRID ──────────────────────────── */}
        <div className="pt-20 border-t border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h2 className="text-3xl font-black flex items-center gap-3">
                  <Star size={28} className="text-emerald-500 fill-emerald-500" /> Curated Roadmap Library
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    className={`rounded-xl text-[11px] font-black h-9 px-4 uppercase tracking-widest transition-all ${selectedCategory === cat ? "shadow-lg shadow-primary/20" : "border-primary/5 bg-card/30"}`}
                    onClick={() => setSelectedCategory(cat as ResourceCategory)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStatic.map((resource) => (
              <Card key={resource.id} className="p-6 border-2 border-primary/5 bg-card/40 backdrop-blur-xl hover:border-primary/20 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-md">
                        {resource.category}
                      </span>
                      <button onClick={() => toggleFavorite(resource.id)} className="transition-transform active:scale-95">
                        <Heart size={20} className={favorited.has(resource.id) ? "fill-red-500 text-red-500" : "text-muted-foreground/30"} />
                      </button>
                  </div>
                  <h3 className="text-lg font-black mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-6 line-clamp-3 leading-relaxed">{resource.description}</p>
                </div>
                <Button 
                    className="w-full rounded-xl h-12 font-black uppercase tracking-widest text-[11px]"
                    onClick={() => window.open(resource.url, "_blank")}
                >
                    Visit Repository <ExternalLink size={14} className="ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

function HighlightCard({ title, desc, btnText, onClick, gradient, isPrimary = false }: any) {
  return (
    <Card className={`p-8 border-2 border-primary/5 bg-gradient-to-br ${gradient} backdrop-blur-3xl group relative overflow-hidden transition-all hover:border-primary/30`}>
      <div className="relative z-10">
        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium mb-6 max-w-md leading-relaxed">{desc}</p>
        <Button 
            className={`rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[11px] ${isPrimary ? 'bg-primary' : 'bg-card/40 hover:bg-card/60 text-foreground border border-white/5'}`}
            onClick={onClick}
        >
            {btnText}
        </Button>
      </div>
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <FileText size={80} className="rotate-12" />
      </div>
    </Card>
  )
}

export default function ResourcesPage() {
  return (
    <ProtectedRoute>
      <ResourcesContent />
    </ProtectedRoute>
  )
}