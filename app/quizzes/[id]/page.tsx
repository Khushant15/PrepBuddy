"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db, auth } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { saveQuizProgress } from "@/lib/progress-service"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight } from "lucide-react"

type Question = {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()

  const quizId = params?.id as string | undefined

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [progressSaved, setProgressSaved] = useState(false)

  // ✅ FETCH QUESTIONS (SOURCE-AWARE)
  useEffect(() => {
    if (!quizId) return

    const fetchQuestions = async () => {
      try {
        setLoading(true)

        // 1. Check if this is a dynamic API-driven quiz
        if (quizId.startsWith("dynamic-")) {
            const parts = quizId.split("-")
            const category = parts[1] || "JavaScript"
            const difficulty = parts[2] || "Medium"
            
            const limit = difficulty === "Easy" ? 30 : 20;
            const idToken = await auth?.currentUser?.getIdToken()
            const res = await fetch(`/api/quizzes?category=${category}&difficulty=${difficulty}&limit=${limit}`, {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            })
            const data = await res.json()
            
            if (data.error) throw new Error(data.error)

            // Map QuizAPI format to our internal Question type
            const mappedQuestions = data.map((q: any) => {
                // Find correct answer index (answer_a_correct -> 0, etc.)
                let correctIdx = 0
                const keys = ["answer_a_correct", "answer_b_correct", "answer_c_correct", "answer_d_correct", "answer_e_correct", "answer_f_correct"]
                for (let i = 0; i < keys.length; i++) {
                    if (q.correctAnswers[keys[i]] === "true") {
                        correctIdx = i
                        break
                    }
                }

                return {
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    correctAnswer: correctIdx,
                    explanation: q.explanation
                }
            })

            setQuestions(mappedQuestions)
            // ✅ SYNC TIMER: Fixed 25 minutes (1500 seconds)
            setTimeLeft(1500)
        } 
        // 2. Otherwise, fetch from Firestore (Static/Saved quizzes)
        else if (db) {
            const snapshot = await getDocs(
                collection(db, "quizzes", quizId, "questions")
            )

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Question[]

            setQuestions(data)
            // ✅ SYNC TIMER: Fixed 25 minutes (1500 seconds)
            setTimeLeft(1500)
        }
      } catch (err) {
        console.error("Error fetching questions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [quizId])

  // ✅ TIMER
  useEffect(() => {
    if (showResults) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showResults])

  // ✅ SAVE PROGRESS
  useEffect(() => {
    if (!quizId) return

    if (showResults && !progressSaved && questions.length > 0) {
      saveQuizProgress(quizId, score, questions.length)
      setProgressSaved(true)
    }
  }, [showResults, quizId, score, questions.length, progressSaved])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading quiz...
      </div>
    )
  }

  if (!quizId || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No questions found.
      </div>
    )
  }

  const question = questions[currentQuestion]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = index
    setSelectedAnswers(newAnswers)

    if (index === question.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  // ✅ RESULTS SCREEN
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Quiz Complete
          </h2>

          <p className="text-center mb-2">
            Score: {score} / {questions.length}
          </p>

          <p className="text-center text-primary font-bold mb-6">
            {percentage}%
          </p>

          <Button
            onClick={() => router.push("/quizzes")}
            className="w-full mb-3"
          >
            Back to Quizzes
          </Button>

          <Button
            onClick={() => {
              setCurrentQuestion(0)
              setScore(0)
              setSelectedAnswers([])
              setShowResults(false)
              setTimeLeft(1500)
              setProgressSaved(false)
            }}
            className="w-full"
          >
            Retake Quiz
          </Button>
        </Card>
      </main>
    )
  }

  // ✅ QUESTION SCREEN
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-xl w-full">
        <div className="flex justify-between mb-4">
          <span>
            Question {currentQuestion + 1} / {questions.length}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={16} />
            {formatTime(timeLeft)}
          </span>
        </div>

        <h2 className="text-xl mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-3 border rounded text-left transition
                ${
                  selectedAnswers[currentQuestion] === index
                    ? "bg-primary text-white border-primary"
                    : "hover:bg-primary/10"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="w-full mt-6"
        >
          {currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
          <ChevronRight />
        </Button>
      </Card>
    </main>
  )
}