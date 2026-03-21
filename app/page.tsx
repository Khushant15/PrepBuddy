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
} from "lucide-react";

import { ParticlesBackground } from "@/components/particles-background";
import { AnimatedGradient } from "@/components/animated-gradient";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);

    setTimeout(() => {
      setContactSubmitted(false);
      setEmail("");
      setName("");
      setMessage("");
    }, 3000);
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

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 text-sm">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Users size={18} className="text-primary" />
                  <span>50K+ Students Prepared</span>
                </div>

                <div className="hidden sm:block w-px bg-border/50"></div>

                <div className="flex items-center gap-2 text-foreground/80">
                  <BookOpen size={18} className="text-accent" />
                  <span>10K+ Practice Questions</span>
                </div>

                <div className="hidden sm:block w-px bg-border/50"></div>

                <div className="flex items-center gap-2 text-foreground/80">
                  <Star size={18} className="text-primary" />
                  <span>98% Success Rate</span>
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

        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
          <div className="container mx-auto max-w-3xl">

            <h2 className="text-4xl font-bold text-center mb-4">
              Get In Touch
            </h2>

            <p className="text-center text-foreground/70 mb-12">
              Have questions? We'd love to hear from you.
            </p>

            <Card className="p-8 border-primary/20 bg-card/40 backdrop-blur-sm">

              <form onSubmit={handleContactSubmit} className="space-y-5">

                <input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background/50"
                />

                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background/50"
                />

                <textarea
                  required
                  placeholder="Tell us how we can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background/50 h-32 resize-none"
                />

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Send Message
                </Button>

                {contactSubmitted && (
                  <div className="p-3 bg-primary/20 border border-primary/40 rounded-lg text-center text-sm text-primary font-medium">
                    Thank you for reaching out! We'll get back to you soon.
                  </div>
                )}

              </form>

            </Card>

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