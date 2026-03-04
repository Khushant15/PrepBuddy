"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

import { Card } from "@/components/ui/card"

import {
  Zap,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react"

import ProgressBar from "@/components/progress-bar"
import DailyTip from "@/components/daily-tip"

import {
  initializeProgress,
  getUserProgress,
} from "@/lib/progress-service"


function DashboardContent() {

  const { user } = useAuth()

  const [progressData, setProgressData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadDashboard = async () => {

      if (!user) return

      await initializeProgress()

      const progress = await getUserProgress()
      setProgressData(progress)

      setLoading(false)
    }

    loadDashboard()

  }, [user])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </main>
    )
  }

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User"

  const xp = progressData?.xp || 0
  const level = progressData?.level || 0
  const nextLevelXP = 100

  return (
    <main className="min-h-screen bg-background">

      <div className="container mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {userName} 👋
          </h1>
        </div>

        {/* XP Progress */}
        <Card className="p-6 mb-6">
          <p className="mb-2 font-semibold">Level {level}</p>
          <ProgressBar percentage={(xp / nextLevelXP) * 100} />
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <StatCard
            label="Quizzes Done"
            value={progressData?.quizzesCompleted || 0}
            icon={<BookOpen />}
          />

          <StatCard
            label="Questions Answered"
            value={progressData?.questionsAnswered || 0}
            icon={<TrendingUp />}
          />

          <StatCard
            label="Streak"
            value={progressData?.streak || 0}
            icon={<Zap />}
          />

          <StatCard
            label="Weekly Goal"
            value={progressData?.weeklyTarget || 0}
            icon={<Target />}
          />

        </div>

        {/* Daily Tip */}
        <div className="mt-6">
          <DailyTip />
        </div>

      </div>

    </main>
  )
}


function StatCard({ label, value, icon }: any) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <div className="mt-2">{icon}</div>
    </Card>
  )
}


export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}