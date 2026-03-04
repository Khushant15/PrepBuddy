"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { BookOpen, Clock, Star } from "lucide-react"

type Quiz = {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration: number
  questionCount: number
}

export default function QuizzesPageWrapper() {
  return (
    <ProtectedRoute>
      <QuizzesPage />
    </ProtectedRoute>
  )
}

function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "quizzes"))

        const quizData: Quiz[] = []

        for (const docSnap of snapshot.docs) {
          const quizId = docSnap.id
          const quiz = docSnap.data()

          const questionsSnapshot = await getDocs(
            collection(db, "quizzes", quizId, "questions")
          )

          quizData.push({
            id: quizId,
            title: quiz.title,
            description: quiz.description,
            topic: quiz.topic,
            difficulty: quiz.difficulty,
            duration: quiz.duration,
            questionCount: questionsSnapshot.size
          })
        }

        setQuizzes(quizData)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading quizzes...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Interview Prep Quizzes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
              <Card className="p-6 cursor-pointer hover:border-primary transition">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium">
                    {quiz.difficulty}
                  </span>
                  <BookOpen size={20} />
                </div>

                <h3 className="font-bold text-lg mb-2">
                  {quiz.title}
                </h3>

                <p className="text-sm text-foreground/70 mb-4">
                  {quiz.description}
                </p>

                <div className="flex justify-between text-sm text-foreground/60">
                  <div className="flex gap-1 items-center">
                    <Clock size={16} />
                    {quiz.duration} min
                  </div>

                  <div className="flex gap-1 items-center">
                    <Star size={16} />
                    {quiz.questionCount} questions
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}