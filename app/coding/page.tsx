"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Play, 
  Code2, 
  Terminal, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Loader,
  BrainCircuit,
  MessageSquare,
  Sparkles
} from "lucide-react"
import { SUPPORTED_LANGUAGES } from "@/lib/judge0-service"
import { toast } from "sonner"

export default function CodingPage() {
  return (
    <ProtectedRoute>
      <CodingContent />
    </ProtectedRoute>
  )
}

function CodingContent() {
  const [code, setCode] = useState(`// Solve: Return the sum of two numbers\nfunction sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(5, 10));`)
  const [languageId, setLanguageId] = useState(63) // Node.js
  const [output, setOutput] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    setLoading(true)
    setOutput(null)
    try {
      const idToken = await auth?.currentUser?.getIdToken()
      const res = await fetch("/api/coding/execute", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ sourceCode: code, languageId })
      })

      const result = await res.json()
      setOutput(result)
      
      if (result.status?.id === 3) {
        toast.success("Code Executed Successfully")
      } else {
        toast.error(`Execution failed: ${result.status?.description || "Error"}`)
      }
    } catch (err) {
      toast.error("Internal compiler error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                    <BrainCircuit size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Compiler Layer 1</span>
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic tracking-tighter">
                    Elite Coding Practice
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">RapidAPI Judge0 Execution Mode enabled.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-2xl border border-primary/10">
                <select 
                    value={languageId} 
                    onChange={(e) => setLanguageId(Number(e.target.value))}
                    className="bg-transparent border-none outline-none font-bold text-sm px-4 py-2"
                >
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                </select>
                <Button 
                    onClick={handleRun} 
                    disabled={loading}
                    className="rounded-xl px-8 font-black shadow-lg shadow-primary/20 gap-2"
                >
                    {loading ? <Loader className="animate-spin" size={18} /> : <Play size={18} />}
                    {loading ? "COMPILING..." : "RUN CODE"}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[650px]">
            
            {/* Code Editor Area */}
            <Card className="flex flex-col border-2 border-primary/10 overflow-hidden shadow-2xl bg-[#0d1117]">
                <div className="bg-[#161b22] p-4 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Code2 className="text-primary" size={16} />
                        <span className="text-xs font-black uppercase text-muted-foreground">Main.js</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                    </div>
                </div>
                <textarea 
                    className="flex-1 bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-gray-300"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                />
            </Card>

            {/* Output Area */}
            <div className="flex flex-col gap-6">
                <Card className="flex-1 flex flex-col border-2 border-primary/10 bg-card/50 overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-primary/10 flex items-center gap-2 bg-muted/20">
                        <Terminal className="text-primary" size={16} />
                        <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Execution Result</span>
                    </div>
                    
                    <div className="flex-1 p-6 font-mono text-xs overflow-y-auto">
                        {!output && !loading && (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                                <Terminal size={48} className="mb-4" />
                                <p className="font-bold">Awaiting code execution...</p>
                            </div>
                        )}
                        
                        {loading && (
                            <div className="h-full flex flex-col items-center justify-center animate-pulse text-primary">
                                <Loader size={32} className="animate-spin mb-4" />
                                <p className="font-black uppercase tracking-widest text-sm">Transmitted to Judge0 Cluster</p>
                            </div>
                        )}

                        {output && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-primary font-black uppercase mb-1 flex items-center gap-1.5">
                                        <CheckCircle2 size={12} /> Standard Output
                                    </p>
                                    <pre className="bg-muted/30 p-4 rounded-xl text-green-400 whitespace-pre-wrap">
                                        {output.stdout || "[No Output]"}
                                    </pre>
                                </div>
                                {output.stderr && (
                                    <div>
                                        <p className="text-red-500 font-black uppercase mb-1 flex items-center gap-1.5">
                                            <AlertCircle size={12} /> Error Details
                                        </p>
                                        <pre className="bg-red-500/5 p-4 rounded-xl text-red-400 whitespace-pre-wrap text-[10px]">
                                            {output.stderr}
                                        </pre>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-primary/10 flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Status</p>
                                        <p className="font-bold text-primary">{output.status?.description}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Time</p>
                                        <p className="font-bold">{output.time ? `${output.time}s` : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Memory</p>
                                        <p className="font-bold">{output.memory ? `${output.memory} KB` : "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* AI Suggestions Card */}
                <Card className="p-6 border-2 border-primary/10 bg-primary/5 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:rotate-12 transition-transform">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-tight">AI Hint System</h4>
                            <p className="text-xs text-muted-foreground">Connect with Groq for optimized code suggestions.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <MessageSquare size={18} className="text-primary" />
                    </Button>
                </Card>
            </div>
        </div>
      </div>
    </main>
  )
}
