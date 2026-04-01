"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { ExternalLink, BookOpen, Database, Globe, Layers, CheckCircle2, ChevronRight, HelpCircle, Sparkles } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Quiz = {
  question: string
  options: string[]
  answer: string
  explanation: string
}

const topicLinks: Record<string, string> = {
  Array: "https://leetcode.com/problem-list/5iwt4mws/",
  String: "https://leetcode.com/problem-list/5iwkvpit/",
  Matrix: "https://leetcode.com/problem-list/5iwkey46/",
  "Bit Manipulation": "https://leetcode.com/problem-list/5iw8d2l1/",
  "Linked List": "https://leetcode.com/problem-list/5iw6zodi/",
  "Dynamic Programming": "https://leetcode.com/problem-list/5iw8y6z7/",
  Heap: "https://leetcode.com/problem-list/5iwgdqcm/",
  Graph: "https://leetcode.com/problem-list/5iw3e1wt/",
  Tree: "https://leetcode.com/problem-list/5iwk3292/",
}

const cnQuiz: Quiz[] = [
  {
    question: "The computer network is",
    options: [
      "Network computer with cable",
      "Network computer without cable",
      "Both of the above",
      "None of the above",
    ],
    answer: "Both of the above",
    explanation:
      "A computer network can be wired (using cables) or wireless (WiFi). Both methods connect computers to share data and resources.",
  },
  {
    question: "FTP stands for",
    options: [
      "File transfer protocol",
      "File transmission protocol",
      "Form transfer protocol",
      "Form transmission protocol",
    ],
    answer: "File transfer protocol",
    explanation:
      "FTP is a standard network protocol used to transfer files between a client and server over the internet.",
  },
  {
    question: "Which is the main function of transport layer?",
    options: [
      "Node to node delivery",
      "End to end delivery",
      "Synchronization",
      "Updating routing tables",
    ],
    answer: "End to end delivery",
    explanation:
      "The transport layer ensures reliable communication between end systems using protocols like TCP and UDP.",
  },
]

function InterviewNotesContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">

        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-primary" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">Theo-Lab</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-white to-emerald-400 bg-clip-text text-transparent leading-none mb-4">
                Interview Notes
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
                Master the fundamental theory frequently asked in technical interviews. 
                Comprehensive notes on OS, DBMS, Networks, and OOPS.
            </p>
        </div>

        {/* ── QUICK NAV ─────────────────────────────────────── */}
        <Card className="p-8 mb-16 bg-card/40 backdrop-blur-xl border-2 border-primary/5 rounded-[32px]">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Layers size={20} className="text-primary" /> Guide Roadmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-xs italic">01</div>
                <p className="text-sm font-bold text-muted-foreground">Most frequent coding categories & LeetCode tracking.</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500 font-black text-xs italic">02</div>
                <p className="text-sm font-bold text-muted-foreground">Deep dives into core Subject fundamentals (OS/DBMS/CN).</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent font-black text-xs italic">03</div>
                <p className="text-sm font-bold text-muted-foreground">Interactive MCQ quiz to validate your domain knowledge.</p>
            </div>
          </div>
        </Card>

        {/* ── CODING CATEGORIES ─────────────────────────────── */}
        <div className="mb-20">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <CheckCircle2 size={28} className="text-primary" /> Coding Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(topicLinks).map((topic) => (
              <Card
                key={topic}
                onClick={() => window.open(topicLinks[topic], "_blank")}
                className="p-5 border-2 border-primary/5 hover:border-primary/20 bg-card/30 backdrop-blur-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <span className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{topic}</span>
                <ExternalLink size={14} className="text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Card>
            ))}
          </div>
        </div>

        {/* ── SUBJECT FUNDAMENTALS ──────────────────────────── */}
        <div className="mb-20">
          <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
              <Globe size={28} className="text-primary" /> Core CS Subjects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <SubjectCard 
                icon={<Layers className="text-blue-400" />} 
                title="Operating Systems" 
                topics={["Process vs Threads", "Scheduling Algorithms", "Memory Management", "Deadlocks", "Paging/Segmentation", "Mutex vs Semaphore"]}
            />
            <SubjectCard 
                icon={<Database className="text-emerald-400" />} 
                title="DBMS Mastery" 
                topics={["Normalization (1NF-3NF/BCNF)", "Indexing Types", "SQL Joins & Queries", "ACID Properties", "Concurrency Control"]}
            />
            <SubjectCard 
                icon={<Globe className="text-amber-400" />} 
                title="Computer Networks" 
                topics={["OSI Model (7 Layers)", "TCP vs UDP", "DNS/DHCP/FTP Protocols", "HTTP vs HTTPS", "Network Topologies"]}
            />
            <SubjectCard 
                icon={<Sparkles className="text-primary" />} 
                title="OOPS Paradigm" 
                topics={["Encapsulation/Abstraction", "Inheritance Types", "Dynamic Polymorphism", "Constructors/Destructors", "Virtual Functions"]}
            />
          </div>
        </div>

        {/* ── QUIZ SECTION ──────────────────────────────────── */}
        <div className="pt-12 border-t border-primary/10">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                  <HelpCircle size={32} className="text-primary" /> Networks Quiz
              </h2>
              <div className="flex flex-col gap-4">
                {cnQuiz.map((quiz, index) => (
                  <Card
                    key={index}
                    className={`p-8 border-2 transition-all cursor-pointer group ${openIndex === index ? 'border-primary/40 bg-card/60 ring-4 ring-primary/5' : 'border-primary/5 hover:border-primary/20 bg-card/40'}`}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-black group-hover:text-primary transition-colors leading-tight mb-4">
                              {quiz.question}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                              {quiz.options.map((opt) => (
                                <div key={opt} className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-primary/5 px-4 py-2 rounded-xl">
                                    <ChevronRight size={10} className="text-primary" /> {opt}
                                </div>
                              ))}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {openIndex === index && (
                          <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: "auto", opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                          >
                            <div className="mt-6 pt-6 border-t border-primary/10">
                                <p className="text-[9px] font-black uppercase text-emerald-400 tracking-[0.3em] mb-3">Correct Answer</p>
                                <div className="text-sm text-emerald-400 font-black mb-4">
                                  {quiz.answer}
                                </div>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                                  "{quiz.explanation}"
                                </p>
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
    </main>
  )
}

function SubjectCard({ icon, title, topics }: { icon: React.ReactNode; title: string; topics: string[] }) {
    return (
        <Card className="p-8 border-2 border-primary/5 bg-card/30 backdrop-blur-xl hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-card rounded-2xl border border-primary/10 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-xl font-black">{title}</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {topics.map(t => (
                    <div key={t} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <CheckCircle2 size={14} className="text-primary/40 shrink-0" />
                        {t}
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default function InterviewNotesPage() {
  return (
    <ProtectedRoute>
      <InterviewNotesContent />
    </ProtectedRoute>
  )
}