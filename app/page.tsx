"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

import {
  CheckCircle,
  Zap,
  BarChart3,
  Brain,
  Briefcase,
  Code,
  ChevronRight,
  Star,
  Users,
  BookOpen,
  Target,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
} from "lucide-react";

import { ParticlesBackground } from "@/components/particles-background";
import { AnimatedGradient } from "@/components/animated-gradient";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("access_key", "0e4a70e0-9df8-45b2-b472-431e5a710291");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject || "New Contact Form Submission from PrepBuddy");
    formData.append("message", message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedGradient />
      <ParticlesBackground />

      <div className="relative z-10">

        {/* ---------------- NAVBAR ---------------- */}

        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

            <h1
              className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
              onClick={() => router.push("/")}
            >
              PrepBuddy
            </h1>

            <div className="flex items-center gap-3">

              {user ? (
                <Button
                  className="bg-gradient-to-r from-primary to-accent"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-primary to-accent"
                    onClick={() => router.push("/signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}

            </div>
          </div>
        </header>

        {/* ---------------- HERO SECTION ---------------- */}

        <section className="pt-40 pb-40 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8 text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/5 backdrop-blur-sm">
                <Zap size={16} className="text-primary animate-pulse-glow" />
                <span className="text-xs sm:text-sm text-foreground/90 font-medium">
                  AI-Powered Interview Mastery Platform
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  Crack Interviews
                </span>
                <span className="block text-foreground mt-2">
                  Level Up. Get Hired.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto">
                Master your tech interviews with AI-powered coaching, real company questions, and personalized roadmaps.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base px-8 py-7 text-foreground font-semibold rounded-lg shadow-lg shadow-primary/30 animate-glow-pulse"
                  onClick={() => router.push("/signup")}
                >
                  Start Preparing Now
                  <ChevronRight size={18} className="ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10 text-base px-8 py-7 rounded-lg bg-card/30 backdrop-blur-sm"
                  onClick={() => {
                    const featuresSection = document.getElementById("features");
                    featuresSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Features
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 text-sm font-medium tracking-tight italic">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Brain size={18} className="text-primary" />
                  <span>Score-Based Domain Detection</span>
                </div>

                <div className="hidden sm:block w-px bg-border/50 h-4 self-center"></div>

                <div className="flex items-center gap-2 text-foreground/80">
                  <Target size={18} className="text-accent" />
                  <span>Project-Anchored Match Engine</span>
                </div>

                <div className="hidden sm:block w-px bg-border/50 h-4 self-center"></div>

                <div className="flex items-center gap-2 text-foreground/80">
                  <Zap size={18} className="text-primary" />
                  <span>Entry-Level Career Roadmaps</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------- FEATURES ---------------- */}

        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
          <div className="container mx-auto max-w-6xl">

            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Everything You Need to Ace Interviews
              </h2>

              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Comprehensive tools designed for tech interview success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card
                  key={i}
                  className="p-6 border-primary/20 bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative mb-4">

                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                      <feature.icon size={20} className="text-primary" />
                    </div>

                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                </Card>
              ))}
            </div>

          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}

        {/* ---------------- CONTACT ---------------- */}

        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* Contact Info */}
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Get In Touch
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    Have a question or want to work together? Drop me a message! Our team will get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group p-3 rounded-xl hover:bg-primary/5 transition-colors duration-300 border border-transparent hover:border-primary/10">
                    <div className="bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground/90">Email</h3>
                      <p className="text-foreground/60 transition-colors group-hover:text-foreground">khushantsharma766@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group p-3 rounded-xl hover:bg-accent/5 transition-colors duration-300 border border-transparent hover:border-accent/10">
                    <div className="bg-accent/10 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground/90">Location</h3>
                      <p className="text-foreground/60 transition-colors group-hover:text-foreground">Vasai, India</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group p-3 rounded-xl hover:bg-gray-500/5 transition-colors duration-300 border border-transparent hover:border-foreground/10">
                    <div className="bg-foreground/10 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Github className="w-6 h-6 text-foreground/80" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground/90">GitHub</h3>
                      <a
                        href="https://github.com/Khushant15"
                        className="text-foreground/60 transition-colors hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github.com/Khushant15
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group p-3 rounded-xl hover:bg-blue-500/5 transition-colors duration-300 border border-transparent hover:border-blue-500/10">
                    <div className="bg-blue-500/10 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Linkedin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground/90">LinkedIn</h3>
                      <a
                        href="https://www.linkedin.com/in/khushant-sharma-9318962b2"
                        className="text-foreground/60 transition-colors hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        linkedin.com/in/khushant-sharma-9318962b2
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                <Card className="p-8 border-primary/20 bg-card/40 backdrop-blur-md shadow-2xl shadow-primary/5">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 ml-1">Full Name</label>
                        <input
                          required
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-primary/30 bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-foreground/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-primary/30 bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-foreground/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 ml-1">Subject</label>
                        <input
                          required
                          placeholder="What is this regarding?"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-primary/30 bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-foreground/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 ml-1">Message</label>
                        <textarea
                          required
                          placeholder="Tell us how we can help..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-primary/30 bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-foreground/30 h-36 resize-none"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 py-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></div>
                          Sending...
                        </span>
                      ) : "Send Message"}
                    </Button>

                    {status === "success" && (
                      <div className="p-3 bg-primary/20 border border-primary/40 rounded-lg text-center text-sm text-primary font-medium animate-in fade-in slide-in-from-top-1">
                        Thank you for reaching out! Your message has been sent successfully.
                      </div>
                    )}

                    {status === "error" && (
                      <div className="p-3 bg-destructive/20 border border-destructive/40 rounded-lg text-center text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                        Oops! Something went wrong. Please try again later.
                      </div>
                    )}
                  </form>
                </Card>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

const features = [
  { icon: Code, title: "AI Interview Coach", description: "Practice with real-time AI feedback and guidance." },
  { icon: Briefcase, title: "Company Questions", description: "Real interview questions from top tech companies." },
  { icon: Brain, title: "Tech Quizzes", description: "Master DSA, DBMS, OS, OOPS, Web concepts." },
  { icon: BarChart3, title: "Progress Tracking", description: "Streaks, heatmaps and analytics." },
  { icon: CheckCircle, title: "HR Prep Suite", description: "Behavioral question bank with STAR templates." },
  { icon: Zap, title: "Role-Based Roadmaps", description: "Personalized learning paths." },
];