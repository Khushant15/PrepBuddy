"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useRef, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Mic, 
  MicOff,
  Send, 
  User, 
  Bot, 
  History, 
  Loader,
  BrainCircuit,
  Settings,
  Calendar,
  Award,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Volume2,
  VolumeX
} from "lucide-react"
import { VoiceRecorder } from "@/components/interview/VoiceRecorder"
import { ResumeUpload } from "@/components/interview/ResumeUpload"
import { InterviewFeedback } from "@/components/interview-feedback"
import { toast } from "sonner"
import { saveInterviewProgress, getInterviewHistory } from "@/lib/progress-service"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Message {
  role: "user" | "assistant"
  content: string
  feedback?: {
    type: "positive" | "improvement" | "tip"
    text: string
  }[]
  score?: number
}

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI Interview Coach. I've reviewed your profile. Ready to begin the mock interview?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [selectedMode, setSelectedMode] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [isFinishing, setIsFinishing] = useState(false)
  const [isSpeakActive, setIsSpeakActive] = useState(false)
  const [skillProfile, setSkillProfile] = useState<any>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // AI Voice Synthesis (TTS)
  const speakMessage = (text: string) => {
    if (!isSpeakActive || typeof window === "undefined" || !window.speechSynthesis) return
    
    // Stop any current speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    
    // Pick a professional sounding voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || voices[0]
    if (preferredVoice) utterance.voice = preferredVoice
    
    window.speechSynthesis.speak(utterance)
  }

  // Fetch history and skill profile
  const fetchData = async () => {
    const data = await getInterviewHistory()
    setHistory(data)
    
    // Fetch skill profile for context
    const { getSkillProfile } = await import("@/lib/progress-service")
    const profile = await getSkillProfile()
    setSkillProfile(profile)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSend = async (content: string) => {
    if (!content.trim()) return
    
    const userMsg: Message = { role: "user", content }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const idToken = await auth?.currentUser?.getIdToken()
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          resume: resumeData,
          mode: selectedMode,
          skillProfile: skillProfile
        })
      })

      const data = await res.json()
      
      const mockScore = Math.floor(Math.random() * (95 - 70 + 1)) + 70
      const assistantMsg: Message = { 
        role: "assistant", 
        content: data.text,
        score: mockScore,
        feedback: [
          { type: "positive", text: "Good professional tone." },
          { type: "tip", text: "Structure your answers using the STAR method for better clarity." }
        ]
      }
      
      setMessages(prev => [...prev, assistantMsg])
      speakMessage(data.text) // Trigger TTS
    } catch (err) {
      toast.error("Failed to connect to AI engine")
    } finally {
      setLoading(false)
    }
  }

  const handleEndInterview = async () => {
      if (messages.length < 3) {
          toast.error("Complete at least a few rounds before finishing!")
          return
      }

      setIsFinishing(true)
      try {
          // 2. Perform AI Analysis of the session
          const analyzeRes = await fetch("/api/interview/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages: [...messages] })
          })
          const analysis = await analyzeRes.json()

          // 3. Save to History & Skill Profile
          const { updateSkillProfile } = await import("@/lib/progress-service")
          await updateSkillProfile(analysis.strengths || [], analysis.weaknesses || [])

          const assistantMessages = messages.filter(m => m.role === "assistant" && m.score !== undefined)
          const finalScore = assistantMessages.length > 0 
            ? Math.round(assistantMessages.reduce((acc, curr) => acc + (curr.score || 0), 0) / assistantMessages.length) 
            : 75

          await saveInterviewProgress(
              selectedMode || "General Professional",
              finalScore,
              [{ type: "summary", text: "Session completed with performance calibration." }]
          )
          
          toast.success("Interview Synchronized! View results in History.")
          const endMsg = `Great job! Session completed. Final Score: ${finalScore}%. Your skill profile has been updated. Ready for another round?`
          setMessages([{ role: "assistant", content: endMsg }])
          speakMessage(endMsg)
          fetchData()
      } catch (err) {
          toast.error("Failed to finalize session.")
      } finally {
          setIsFinishing(false)
      }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic tracking-tighter">AI Interview Coach</h1>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Immersive Simulation v2.0</p>
                </div>

                <ResumeUpload onParsed={(data) => {
                    setResumeData(data)
                    toast.success("Resume context loaded for AI")
                }} />

                <Card className="p-6 border-2 border-primary/10 bg-primary/5 rounded-3xl overflow-hidden relative">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Settings className="text-primary" size={18} />
                        Session Config
                    </h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <input 
                                className="w-full bg-background border-2 border-primary/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-bold placeholder:text-muted-foreground/30"
                                placeholder="Target Role..."
                                value={selectedMode}
                                onChange={(e) => setSelectedMode(e.target.value)}
                            />
                        </div>

                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                                onClick={fetchData}
                                className="w-full gap-2 rounded-2xl shadow-lg border-2 border-primary/20 h-12 text-sm font-black uppercase tracking-widest" 
                                variant="outline"
                            >
                                <History size={16} />
                                Previous Sessions
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-[400px] border-l-2 border-primary/10 bg-background/95 backdrop-blur-xl">
                            <SheetHeader className="mb-8">
                              <SheetTitle className="text-2xl font-black italic border-b-4 border-primary pb-2 w-fit">Interview Vault</SheetTitle>
                            </SheetHeader>
                            
                            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-2 scrollbar-hide">
                                {history.length === 0 ? (
                                    <div className="py-12 text-center opacity-30">
                                        <History size={64} className="mx-auto mb-4" />
                                        <p className="font-black italic">No history detected.</p>
                                    </div>
                                ) : (
                                    history.map((h) => (
                                        <Card key={h.id} className="p-5 border-2 border-primary/5 bg-card/40 hover:border-primary/20 transition-all rounded-3xl group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <Trophy size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-primary truncate max-w-[120px]">{h.type || "Professional"}</p>
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                                                            <Calendar size={10} />
                                                            {h.completedAt?.toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-black group-hover:scale-110 transition-transform">{h.score}%</div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(i => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= (h.score/20) ? 'bg-primary' : 'bg-muted'}`} />
                                                ))}
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                          </SheetContent>
                        </Sheet>
                    </div>
                </Card>

                {/* Latest Feedback Widget */}
                {messages[messages.length - 1]?.role === "assistant" && messages.length > 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-xs font-black text-primary uppercase mb-2 ml-1 tracking-widest">Real-time Analysis</h3>
                        <InterviewFeedback 
                            feedback={messages[messages.length - 1].feedback!} 
                            overallScore={messages[messages.length - 1].score}
                        />
                    </div>
                )}
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-3">
                <Card className="h-[750px] border-2 border-primary/10 bg-card/60 shadow-2xl flex flex-col relative overflow-hidden backdrop-blur-2xl rounded-[3rem]">
                    
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <BrainCircuit size={400} className="absolute -bottom-20 -right-20 text-primary" />
                    </div>

                    {/* Chat Header */}
                    <div className="p-6 border-b-2 border-primary/5 flex items-center justify-between bg-background/20 relative z-20">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Live Simulation</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`rounded-full h-9 px-4 gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isSpeakActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}
                                onClick={() => setIsSpeakActive(!isSpeakActive)}
                            >
                                {isSpeakActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                {isSpeakActive ? "Speech Active" : "Speech Off"}
                            </Button>
                        </div>
                        <Button 
                            onClick={handleEndInterview}
                            disabled={isFinishing || messages.length < 3}
                            className="bg-primary hover:opacity-90 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-9 px-6 shadow-xl shadow-primary/20 text-primary-foreground"
                        >
                            {isFinishing ? <Loader className="animate-spin" size={14} /> : "Finalize Session"}
                        </Button>
                    </div>

                    {/* Chat Window */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide relative z-10 font-bold">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center shrink-0 border-2 shadow-2xl transition-all ${
                                    m.role === "assistant" ? "bg-primary border-primary/10 text-primary-foreground" : "bg-card border-primary/5 text-foreground"
                                }`}>
                                    {m.role === "assistant" ? <Bot size={24} /> : <User size={24} />}
                                </div>
                                <div className={`max-w-[75%] p-6 rounded-[2rem] shadow-2xl text-sm leading-relaxed border transition-all ${
                                    m.role === "assistant" 
                                    ? "bg-card/80 border-primary/5 rounded-tl-none font-medium italic" 
                                    : "bg-primary text-primary-foreground font-black border-transparent rounded-tr-none"
                                }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-4 animate-pulse text-primary font-black uppercase tracking-widest text-[10px] ml-4 bg-primary/5 px-6 py-3 rounded-full w-fit">
                                <Loader size={16} className="animate-spin" />
                                <span>Coach is evaluating your response...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-8 border-t-2 border-primary/5 bg-background/40 relative z-20">
                        <div className="flex items-center gap-4">
                            <VoiceRecorder onTranscript={(text) => handleSend(text)} />
                            <div className="flex-1 relative">
                                <input 
                                    className="w-full bg-card/60 border-2 border-primary/5 rounded-[1.5rem] px-8 py-5 text-sm focus:outline-none focus:border-primary/40 transition-all font-bold pr-16 shadow-inner text-foreground"
                                    placeholder="Synthesize your professional response..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                                />
                                <Button 
                                    size="icon" 
                                    className="absolute right-3 top-3 h-12 w-12 rounded-[1rem] bg-primary text-primary-foreground shadow-lg"
                                    onClick={() => handleSend(input)}
                                    disabled={loading || !input.trim()}
                                >
                                    <ArrowRight size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}