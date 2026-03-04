"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
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

  // ✅ FETCH QUESTIONS (FIXED)
  useEffect(() => {
    if (!quizId) return

    const fetchQuestions = async () => {
      try {
        setLoading(true)

        const snapshot = await getDocs(
          collection(db, "quizzes", quizId, "questions")
        )

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[]

        setQuestions(data)
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
              setTimeLeft(1800)
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