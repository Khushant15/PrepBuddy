"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Cpu, 
  Cloud,
  ChevronRight,
  Zap,
  Lock,
  Globe,
  Fingerprint,
  Radio,
  Share2,
  Mail,
  Smartphone,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"

type TabType = "Privacy" | "Notifications" | "Auth" | "Cloud" | "Data" | "Regional"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Privacy")
  const [preferences, setPreferences] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("prepbuddy-preferences")
    if (saved) {
      setPreferences(JSON.parse(saved))
    } else {
        // Initial defaults
        setPreferences({
          "auto-sync": true,
          "smart-speech": true,
          "job-matcher": false,
          "bio-auth": false,
          "encrypt-data": true,
          "public-profile": false,
          "job-alerts": true,
          "streak-reminders": true,
          "ai-suggestions": true,
          "email-notifications": true
        })
    }
  }, [])

  const handleToggle = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCommit = () => {
    localStorage.setItem("prepbuddy-preferences", JSON.stringify(preferences))
    toast.success("Preferences Synchronized", {
        description: "Your platform configuration (including notifications) has been saved to your profile.",
    })
  }

  if (!mounted) return null

  const tabContent = {
    "Privacy": {
        title: "Expert Privacy",
        icon: <Lock size={14} />,
        settings: [
            { id: "auto-sync", title: "Auto-Sync History", desc: "Push interview sessions to the cloud vault." },
            { id: "smart-speech", title: "Smart Speech Synthesis", desc: "Enable high-fidelity voice output for the Coach." },
            { id: "encrypt-data", title: "End-to-End Encryption", desc: "Encrypt resume analysis data in transit." }
        ]
    },
    "Notifications": {
        title: "Smart Notifications",
        icon: <Bell size={14} />,
        settings: [
            { id: "job-alerts", title: "Job Opportunity Alerts", desc: "Immediate notifications for high-accuracy skill matches." },
            { id: "streak-reminders", title: "Daily Mastery Reminders", desc: "Calibrated alerts before daily streaks expire." },
            { id: "ai-suggestions", title: "Smart Goal Suggestions", desc: "AI-driven roadmap and quiz recommendations." },
            { id: "email-notifications", title: "Email Smart Reports", desc: "Weekly summaries of your performance velocity." }
        ]
    },
    "Auth": {
        title: "Bio-Authentication",
        icon: <Fingerprint size={14} />,
        settings: [
            { id: "bio-auth", title: "Facial Sync Verification", desc: "Use WebAuthn for secure session entry." },
            { id: "mfa", title: "Multi-Factor Secure Key", desc: "Require secondary verification for deletions." }
        ]
    },
    "Cloud": {
        title: "Cloud Intelligence",
        icon: <Cloud size={14} />,
        settings: [
            { id: "job-matcher", title: "Proactive Job Search", desc: "Smart engine scans for roles matching your radar." },
            { id: "api-caching", title: "Expert API Caching", desc: "Cache LLM responses for low-latency searches." }
        ]
    },
    "Data": {
        title: "Data Sovereignty",
        icon: <Database size={14} />,
        settings: [
            { id: "public-profile", title: "Public Leaderboard Rank", desc: "Show your score on the global leader board." },
            { id: "share-analytics", title: "Anonymous Stats Share", desc: "Help the platform engine by sharing meta-trends." }
        ]
    },
    "Regional": {
        title: "Regional Nodes",
        icon: <Globe size={14} />,
        settings: [
            { id: "local-llm", title: "Edge Node Processing", desc: "Prioritize local API endpoints for speed." },
            { id: "global-sync", title: "Universal Sync", desc: "Keep progress consistent across all nodes." }
        ]
    }
  }

  const current = tabContent[activeTab as keyof typeof tabContent]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl text-foreground font-sans">
        
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic tracking-tighter">Global Control Console</h1>
                <p className="text-muted-foreground mt-2 font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Status: Secure Preferences Locked</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border-2 border-primary/20 shadow-2xl shrink-0">
                <SettingsIcon size={28} className="animate-spin-slow" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nav Sidebar */}
            <div className="md:col-span-1 space-y-3">
                <SettingsNav icon={<Lock size={16}/>} label="Expert Privacy" active={activeTab === "Privacy"} onClick={() => setActiveTab("Privacy")} />
                <SettingsNav icon={<Bell size={16}/>} label="Notifications" active={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} />
                <SettingsNav icon={<Fingerprint size={16}/>} label="Bio-Authentication" active={activeTab === "Auth"} onClick={() => setActiveTab("Auth")} />
                <SettingsNav icon={<Cloud size={16}/>} label="Cloud Sync" active={activeTab === "Cloud"} onClick={() => setActiveTab("Cloud")} />
                <SettingsNav icon={<Database size={16}/>} label="Data Sovereignty" active={activeTab === "Data"} onClick={() => setActiveTab("Data")} />
                <SettingsNav icon={<Globe size={16}/>} label="Regional Nodes" active={activeTab === "Regional"} onClick={() => setActiveTab("Regional")} />
            </div>

            {/* Main Config Area */}
            <div className="md:col-span-2 space-y-6">
                <Card className="p-10 border-2 border-primary/10 bg-card/40 rounded-[3rem] shadow-3xl relative overflow-hidden group min-h-[550px] flex flex-col justify-between animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        {current.icon}
                    </div>
                    
                    <div>
                        <h3 className="font-black text-[12px] uppercase tracking-[0.4em] text-primary mb-12 flex items-center gap-3">
                            {current.icon} {current.title.toUpperCase()} // MODULE v4.2
                        </h3>

                        <div className="space-y-8">
                            {current.settings.map((setting) => (
                                <ConfigItem 
                                    key={setting.id}
                                    title={setting.title} 
                                    description={setting.desc} 
                                    enabled={preferences[setting.id] || false} 
                                    onToggle={() => handleToggle(setting.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-primary/10 flex justify-end">
                        <Button 
                            className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-2xl px-12 h-14 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group"
                            onClick={handleCommit}
                        >
                            <Zap size={14} className="mr-2 group-hover:animate-pulse" /> Commit Configuration
                        </Button>
                    </div>
                </Card>

                <Card className="p-8 border-2 border-rose-500/10 bg-rose-500/5 rounded-[2.5rem] border-dashed group">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-rose-500 mb-4 flex items-center gap-2">
                        <Lock size={14} /> Smart Overwrite Zone
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6 font-medium leading-relaxed italic opacity-70">"Purging the data core will permanently erase all assessment logs, roadmap mastery, and AI history. All notification registrations will be REVOKED."</p>
                    <Button variant="outline" className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl px-10 h-10 transition-all">
                        Execute Data Purge
                    </Button>
                </Card>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function SettingsNav({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group relative overflow-hidden ${
                active ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-[1.05]" : "hover:bg-primary/10 text-muted-foreground"
            }`}
        >
            <div className="flex items-center gap-4 relative z-10">
                <span className={active ? "text-primary-foreground" : "text-primary group-hover:scale-110 transition-transform"}>{icon}</span>
                <span className="font-black text-[10px] uppercase tracking-[0.2em] leading-none">{label}</span>
            </div>
            <ChevronRight size={14} className={active ? "opacity-100" : "opacity-0 group-hover:opacity-100 text-primary transition-all translate-x-1"} />
            {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent/20 to-primary opacity-50 animate-pulse-slow" />
            )}
        </button>
    )
}

function ConfigItem({ title, description, enabled, onToggle }: any) {
    return (
        <div 
            onClick={onToggle}
            className="flex items-center justify-between group cursor-pointer hover:bg-primary/5 p-4 rounded-3xl transition-all border border-transparent hover:border-primary/20"
        >
            <div className="flex-1 pr-6">
                <p className="text-[13px] font-black italic tracking-tight mb-1">{title}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 leading-tight">{description}</p>
            </div>
            <div className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 shadow-inner ${enabled ? 'bg-primary shadow-[0_0_20px_#8884d855]' : 'bg-muted'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'translate-x-7 scale-110 shadow-lg' : 'translate-x-0'}`} />
            </div>
        </div>
    )
}
