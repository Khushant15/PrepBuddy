"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, Moon, Sun, Monitor, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useTheme } from "next-themes"
import { useSearch } from "@/lib/search-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/company-questions", label: "Companies" },
  { href: "/hr-prep", label: "Behavioral" },
  { href: "/jobs", label: "Jobs" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/resources", label: "Resources" },
  { href: "/ai-interview", label: "AI Coach" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const search = useSearch()

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (!auth) return
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    if (!auth) return
    await signOut(auth)
    router.push("/")
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              PB
            </div>

            <span className="font-black text-xl bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent italic tracking-tighter hidden sm:block">
              PrepBuddy
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          {user && (
            <div className="hidden lg:flex gap-6 text-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Cmd + K Hint (Desktop Only) */}
          {user && (
            <div 
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-[10px] font-black text-muted-foreground/60 transition-all hover:border-primary/30 cursor-pointer group" 
                onClick={() => search.toggle()}
            >
                <Command size={12} className="group-hover:text-primary" />
                <span>SEARCH</span>
                <span className="bg-background px-1.5 py-0.5 rounded border border-border">K</span>
            </div>
          )}

          {/* Luxury Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary">
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-2 border-primary/10 bg-background/95 backdrop-blur-xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 font-black text-[10px] uppercase rounded-xl">
                <Sun size={14} className="text-orange-500" /> Light Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 font-black text-[10px] uppercase rounded-xl">
                <Moon size={14} className="text-primary" /> Dark Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 font-black text-[10px] uppercase rounded-xl">
                <Monitor size={14} className="text-muted-foreground" /> System Sync
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">
                    Verified
                </span>
                <span className="text-[11px] font-bold text-foreground/70 truncate max-w-[120px]">
                    {user.displayName || user.email.split("@")[0]}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-xl border-primary/20 hover:bg-rose-500/10 hover:border-rose-500/50 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest h-10 px-4 transition-all shadow-xl"
              >
                <LogOut size={14} className="mr-2" />
                Exit
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest rounded-xl h-10 px-6">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent font-black text-[10px] uppercase tracking-widest rounded-xl h-10 px-6 shadow-lg shadow-primary/20">
                  Join Elite
                </Button>
              </Link>
            </div>
          )}

          {/* MOBILE SEARCH & MENU BUTTON */}
          <div className="flex items-center gap-1.5 lg:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary"
                onClick={() => search.toggle()}
              >
                  <Search size={18} />
              </Button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
          </div>

        </div>

      </div>

      {/* MOBILE NAV LINKS */}
      {isOpen && user && (
        <div className="lg:hidden border-t border-border/30 px-4 py-6 space-y-3 bg-background animate-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] bg-primary/5 text-primary border border-primary/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

    </nav>
  )
}