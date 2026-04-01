"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Command, 
  Terminal,
  Search,
  LayoutDashboard,
  BrainCircuit,
  Building2,
  Trophy,
  History,
  Briefcase,
  Settings,
  User,
  Zap,
  ArrowRight
} from "lucide-react"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator, 
  CommandShortcut 
} from "@/components/ui/command"
import { useSearch } from "@/lib/search-context"

export function CommandPalette() {
  const router = useRouter()
  const { open, setOpen } = useSearch()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  if (!mounted) return null

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Elite Search: Type a command or module..." />
        <CommandList className="max-h-[500px] scrollbar-hide">
          <CommandEmpty>No results found for your query.</CommandEmpty>
          
          <CommandGroup heading="Intelligence Center">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Dashboard Analytics</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/ai-interview"))}>
              <BrainCircuit className="mr-2 h-4 w-4 text-accent" />
              <span>AI Interview Studio</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/roadmaps"))}>
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Custom Roadmaps</span>
              <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Industry Prep">
            <CommandItem onSelect={() => runCommand(() => router.push("/company-questions"))}>
                <Building2 className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Company Databases 2.0</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/hr-prep"))}>
                <History className="mr-2 h-4 w-4 text-sky-500" />
                <span>Behavioral Studio</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/quizzes"))}>
                <Trophy className="mr-2 h-4 w-4 text-orange-500" />
                <span>Assessment Lab</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Career Tools">
            <CommandItem onSelect={() => runCommand(() => router.push("/jobs"))}>
                <Briefcase className="mr-2 h-4 w-4 text-primary" />
                <span>Job Intelligence</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Profile Console</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Global Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
