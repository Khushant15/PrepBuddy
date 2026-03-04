"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { jobs } from "@/lib/jobs-data"
import { Bookmark, BookmarkCheck, MapPin, DollarSign, Briefcase } from "lucide-react"
import { ProfileMatchCard } from "@/components/profile-match-card"

type JobType = "All" | "Full-time" | "Internship" | "Contract"
type RemoteType = "All" | "Remote" | "On-site" | "Hybrid"
type RoleType = "All" | "Frontend" | "Backend" | "Full Stack"
type SalaryType = "All" | "0-5" | "5-10" | "10+"

const userProfile = {
  skills: ["Python", "JavaScript", "React", "SQL", "AWS"],
}

export default function JobsPage() {
  return (
    <ProtectedRoute>
      <JobsContent />
    </ProtectedRoute>
  )
}

function JobsContent() {
  const [selectedType, setSelectedType] = useState<JobType>("All")
  const [selectedRemote, setSelectedRemote] = useState<RemoteType>("All")
  const [selectedRole, setSelectedRole] = useState<RoleType>("All")
  const [selectedSalary, setSelectedSalary] = useState<SalaryType>("All")

  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [applied, setApplied] = useState<Set<string>>(new Set())

  const getSalaryNumber = (salary: string) => {
    const match = salary.match(/\d+/)
    return match ? Number(match[0]) : 0
  }

  const calculateMatch = (jobSkills: string[]) => {
    const matched = jobSkills.filter((skill) => userProfile.skills.includes(skill)).length
    return Math.round((matched / jobSkills.length) * 100)
  }

  const filtered = jobs.filter((job) => {
    const salary = getSalaryNumber(job.salary)

    const salaryMatch =
      selectedSalary === "All" ||
      (selectedSalary === "0-5" && salary <= 5) ||
      (selectedSalary === "5-10" && salary > 5 && salary <= 10) ||
      (selectedSalary === "10+" && salary > 10)

    const roleMatch =
      selectedRole === "All" ||
      job.title.toLowerCase().includes(selectedRole.toLowerCase())

    const indiaMatch = job.location.toLowerCase().includes("india")

    return (
      (selectedType === "All" || job.type === selectedType) &&
      (selectedRemote === "All" || job.remote === selectedRemote) &&
      salaryMatch &&
      roleMatch &&
      indiaMatch
    )
  })

  const toggleSave = (id: string) => {
    const newSaved = new Set(saved)
    newSaved.has(id) ? newSaved.delete(id) : newSaved.add(id)
    setSaved(newSaved)
  }

  const toggleApplied = (id: string) => {
    const newApplied = new Set(applied)
    newApplied.has(id) ? newApplied.delete(id) : newApplied.add(id)
    setApplied(newApplied)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">

        <h1 className="text-3xl font-bold mb-6">🇮🇳 India Tech Jobs</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">

          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as JobType)} className="border p-2 rounded">
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select value={selectedRemote} onChange={(e) => setSelectedRemote(e.target.value as RemoteType)} className="border p-2 rounded">
            <option value="All">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as RoleType)} className="border p-2 rounded">
            <option value="All">All Roles</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full Stack">Full Stack</option>
          </select>

          <select value={selectedSalary} onChange={(e) => setSelectedSalary(e.target.value as SalaryType)} className="border p-2 rounded">
            <option value="All">All Salary</option>
            <option value="0-5">0–5 LPA</option>
            <option value="5-10">5–10 LPA</option>
            <option value="10+">10+ LPA</option>
          </select>

        </div>

        {/* Jobs */}
        <div className="space-y-4">

          {filtered.map((job) => {
            const match = calculateMatch(job.skills)

            return (
              <Card key={job.id} className="p-6">

                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-primary">{job.company}</p>

                <div className="flex gap-4 text-sm my-2">
                  <span className="flex items-center gap-1"><Briefcase size={14}/> {job.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salary}</span>
                </div>

                <ProfileMatchCard
                  jobTitle={job.title}
                  matchPercentage={match}
                  matchedSkills={job.skills.filter(s => userProfile.skills.includes(s))}
                  missingSkills={job.skills.filter(s => !userProfile.skills.includes(s))}
                />

                <div className="flex gap-2 mt-4">

                  <Button variant="outline" onClick={() => toggleSave(job.id)}>
                    {saved.has(job.id) ? <BookmarkCheck /> : <Bookmark />}
                  </Button>

                  <Button onClick={() => toggleApplied(job.id)}>
                    {applied.has(job.id) ? "Applied" : "Apply"}
                  </Button>

                </div>

              </Card>
            )
          })}

        </div>

        {filtered.length === 0 && (
          <Card className="p-8 text-center mt-6">
            No Indian jobs found.
          </Card>
        )}

      </div>
    </main>
  )
}
