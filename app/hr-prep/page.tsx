"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Loader, 
  ChevronRight, 
  ExternalLink, 
  Zap, 
  Target, 
  Users, 
  Briefcase, 
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  Award,
  BookOpen,
  Copy
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const SECTIONS = [
  {
    id: "general",
    title: "General Questions",
    icon: <User size={18} />,
    questions: [
      "Tell me about yourself?",
      "Why are you applying for this job?",
      "What do you know about our company?",
      "Why should we hire you?",
      "Describe yourself in three words.",
      "Describe yourself in one word.",
      "What are your strengths?",
      "What are your weaknesses?",
      "What are your hobbies?",
      "What are your achievements in life?",
      "What is your objective in life?",
      "What makes you unique?",
      "How do you handle failure?",
      "How do you handle success?"
    ]
  },
  {
    id: "behavioral",
    title: "Behavioral Questions",
    icon: <Users size={18} />,
    questions: [
      "Tell me about a time you faced a challenge at work.",
      "Give an example of when you worked in a team.",
      "Describe a conflict with a coworker and how you resolved it.",
      "Have you ever failed at something? What did you learn?",
      "Tell me about a time you had to meet a tight deadline.",
      "Have you ever led a team?",
      "Give an example of when you went above and beyond.",
      "Tell me about adapting to a big change.",
      "Describe learning a new skill quickly."
    ]
  },
  {
    id: "work-ethic",
    title: "Work Ethic & Motivation",
    icon: <Zap size={18} />,
    questions: [
      "What motivates you to work?",
      "How do you handle stress or pressure?",
      "How do you prioritize tasks?",
      "What is your work style?",
      "How do you handle criticism?",
      "Do you prefer working independently or in a team?",
      "What if you disagree with a manager’s decision?",
      "How do you stay organized?",
      "Would you work overtime or odd hours?",
      "What does success mean to you?",
      "Difference between confidence and overconfidence?",
      "Difference between smart work and hard work?"
    ]
  },
  {
    id: "salary",
    title: "Salary & Availability",
    icon: <Award size={18} />,
    questions: [
      "What are your salary expectations?",
      "When can you start working?",
      "Do you have other job offers?",
      "Are you open to contract or freelance work?",
      "Would you accept a lower salary for the right opportunity?",
      "How long would you expect to work for us?"
    ]
  },
  {
    id: "company",
    title: "Company Specific",
    icon: <Briefcase size={18} />,
    questions: [
      "How will you contribute to our company’s success?",
      "What do you expect from us as an employer?",
      "What makes a great workplace culture?",
      "How do you handle a difficult manager?",
      "How do you stay updated with industry trends?",
      "What do you like about our company’s mission?"
    ]
  },
  {
    id: "resume",
    title: "Resume Related",
    icon: <BookOpen size={18} />,
    questions: [
      "Can you walk me through your resume?",
      "Why are you leaving your current job?",
      "Explain any employment gaps.",
      "What motivated your career path?",
      "Which skills from past jobs help you here?",
      "How did your previous job prepare you for this role?",
      "Tell me about a project you are proud of.",
      "Why did you choose your degree?"
    ]
  }
]

const ANSWER_TIPS: Record<string, string> = {
  "Tell me about yourself?": "Give a 60–90 second summary: background → skills → achievements → why you're interested in the role.",
  "Why are you applying for this job?": "Connect your skills and interests with the role and the company's goals.",
  "What do you know about our company?": "Mention company products, achievements, mission, and culture.",
  "Why should we hire you?": "Highlight your key strengths and explain how you can add value.",
  "Describe yourself in three words.": "Choose professional traits and justify them briefly.",
  "Describe yourself in one word.": "Pick a strong professional quality and support it with an example.",
  "What are your strengths?": "Mention 2–3 strengths with real examples.",
  "What are your weaknesses?": "Mention a real weakness and show how you are improving.",
  "What motivates you to work?": "Talk about learning, impact, solving problems, or growth.",
  "How do you handle stress or pressure?": "Explain your strategy like prioritization, planning, and staying calm.",
  "How do you prioritize tasks?": "Mention prioritization techniques like urgent vs important tasks.",
  "What are your salary expectations?": "Provide a reasonable range and mention flexibility.",
  "When can you start working?": "State your availability honestly.",
  "Can you walk me through your resume?": "Explain your education, experience, and relevant achievements.",
  "Why are you leaving your current job?": "Focus on growth and opportunities.",
  "Explain any employment gaps.": "Be honest and explain productive activities during the gap.",
  "Tell me about a project you are proud of.": "Explain the project, your role, and its impact."
}

function User(props: any) { return <MessageSquare {...props} /> }

export default function HRPrepPage() {
  const [activeCategory, setActiveCategory] = useState("general")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({})
  const [loadingAnswer, setLoadingAnswer] = useState<string | null>(null)

  const currentSection = SECTIONS.find(s => s.id === activeCategory) || SECTIONS[0]

  const generateAIAnswer = async (q: string) => {
    setLoadingAnswer(q)
    try {
      const res = await fetch("/api/hr-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      })
      const data = await res.json()
      setAiAnswers(prev => ({ ...prev, [q]: data.text }))
    } catch (err) {
      toast.error("Failed to sync neural advice.")
    } finally {
      setLoadingAnswer(null)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        {/* Subtle Background Glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Navigation */}
            <aside className="lg:w-72 space-y-3">
              <div className="mb-8 pl-2">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Target size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Mode</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter italic">Behavioral</h1>
                <p className="text-xs text-muted-foreground font-medium">HR & Culture-fit Prep</p>
              </div>

              <div className="space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => { setActiveCategory(section.id); setOpenQuestion(null); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      activeCategory === section.id
                        ? "bg-primary/20 text-primary border-2 border-primary/20 shadow-xl"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-2 border-transparent"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                    {activeCategory === section.id && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                ))}
              </div>

              {/* Recruiter Contacts Highlight */}
              <Card className="mt-8 p-6 border-2 border-accent/20 bg-accent/5 rounded-3xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                      <Users size={64} />
                  </div>
                  <h4 className="font-black text-sm mb-2 flex items-center gap-2">
                      <Award size={16} className="text-accent" /> Recruiter Vault
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-4">
                      Direct contact lists with real HR recruiters across top-tier companies.
                  </p>
                  <Button 
                    className="w-full text-[10px] h-9 rounded-xl font-black uppercase tracking-widest bg-accent hover:opacity-90 shadow-lg"
                    onClick={() => window.open("https://drive.google.com/drive/folders/1hJlxWGMr1UfV9UH84d_HjFP7InTMpPII", "_blank")}
                  >
                    Open Contacts <ExternalLink size={12} className="ml-2" />
                  </Button>
              </Card>
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-8">
              
              {/* Pro Prep Card */}
              <Card className="p-8 border-2 border-primary/20 bg-card/10 backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                 <div className="absolute top-0 right-10 rotate-12 opacity-5">
                    <BrainCircuit size={160} />
                 </div>
                 <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl">
                    <MessageSquare size={40} />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-black tracking-tight mb-2 italic">Neural Behavioral Studio</h2>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                        Research company mission, practice STAR method answers, and maintain authentic confidence. 
                        Use the AI generator below to synthesize perfect model responses.
                    </p>
                 </div>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                <h2 className="text-xl font-black italic flex items-center gap-3 pl-4 border-l-4 border-primary">
                  {currentSection.title} <span className="text-xs text-muted-foreground not-italic font-medium opacity-60">({currentSection.questions.length} Scenario Units)</span>
                </h2>

                <div className="grid gap-3">
                  {currentSection.questions.map((q, idx) => (
                    <Card 
                        key={idx} 
                        className={`p-0 overflow-hidden border-2 transition-all transition-duration-500 rounded-3xl ${
                            openQuestion === q ? "border-primary/40 bg-primary/5 shadow-2xl" : "border-primary/5 bg-card/40 hover:border-primary/10"
                        }`}
                    >
                      <button
                        onClick={() => setOpenQuestion(openQuestion === q ? null : q)}
                        className="w-full text-left p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center text-[10px] font-black text-muted-foreground">
                                {idx + 1}
                            </div>
                            <span className="font-black text-sm tracking-tight">{q}</span>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 ${openQuestion === q ? "rotate-90 bg-primary text-white" : "bg-muted/30"}`}>
                            <ChevronRight size={16} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {openQuestion === q && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="px-8 pb-8 space-y-6">
                              {/* Instant Tip Panel */}
                              {ANSWER_TIPS[q] && (
                                <div className="p-5 bg-card/60 border border-primary/20 rounded-2xl relative">
                                    <div className="absolute top-[-10px] left-5 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Instant Expert Tip</div>
                                    <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                                        "{ANSWER_TIPS[q]}"
                                    </p>
                                </div>
                              )}

                              {/* AI Controls */}
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button 
                                    className="w-full sm:w-auto gap-2 rounded-xl h-10 px-8 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                                    onClick={() => generateAIAnswer(q)}
                                    disabled={loadingAnswer === q}
                                >
                                    {loadingAnswer === q ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                    Generate Model Response
                                </Button>
                                {!loadingAnswer && !aiAnswers[q] && (
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Powered by Neural Llama-3.3</p>
                                )}
                              </div>

                              {/* AI Response Panel */}
                              {aiAnswers[q] && (
                                <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] relative group animate-in zoom-in-95 duration-500">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                                        <BrainCircuit size={14} /> Expert Analysis / STAR Method
                                    </h5>
                                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-foreground font-medium">
                                        {aiAnswers[q]}
                                    </div>
                                    <button 
                                        className="absolute top-4 right-4 p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => { navigator.clipboard.writeText(aiAnswers[q]); toast.success("Advice copied to clipboard."); }}
                                    >
                                        <Copy size={14} className="text-primary" />
                                    </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}