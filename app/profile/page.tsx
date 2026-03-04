"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Settings, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

function ProfileContent() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Profile Settings
          </h1>
          <p className="text-foreground/60">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">

            <Card className="p-6 border-border/50 bg-card/50">
              <div className="flex items-start justify-between mb-6">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                    {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {user?.displayName || "User"}
                    </h2>
                    <p className="text-foreground/60">
                      {user?.email}
                    </p>
                  </div>

                </div>

                <Button size="sm" variant="outline">
                  <Edit2 size={16} />
                  Edit
                </Button>

              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground/70">
                    Full Name
                  </label>
                  <p className="text-lg font-medium">
                    {user?.displayName || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground/70">
                    Email
                  </label>
                  <p className="text-lg font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </main>
  )
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}