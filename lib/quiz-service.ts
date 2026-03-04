"use client"

import { db } from "@/lib/firebase"

import {
  collection,
  doc,
  getDocs,
  getDoc
} from "firebase/firestore"


export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}


export interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration: number
  questions: QuizQuestion[]
}



// GET ALL QUIZZES
export async function getQuizzes(): Promise<Quiz[]> {

  const quizSnapshot =
    await getDocs(collection(db, "quizzes"))

  const quizzes: Quiz[] = []

  for (const quizDoc of quizSnapshot.docs) {

    const quizData = quizDoc.data()

    const questionsSnapshot =
      await getDocs(
        collection(db, "quizzes", quizDoc.id, "questions")
      )

    const questions: QuizQuestion[] =
      questionsSnapshot.docs.map(q => ({
        id: q.id,
        ...q.data()
      })) as QuizQuestion[]


    quizzes.push({
      id: quizDoc.id,
      ...quizData,
      questions
    } as Quiz)

  }

  return quizzes

}



// GET SINGLE QUIZ
export async function getQuizById(
  quizId: string
): Promise<Quiz | null> {

  const quizRef =
    doc(db, "quizzes", quizId)

  const quizSnap =
    await getDoc(quizRef)

  if (!quizSnap.exists())
    return null


  const questionsSnapshot =
    await getDocs(
      collection(db, "quizzes", quizId, "questions")
    )

  const questions =
    questionsSnapshot.docs.map(q => ({
      id: q.id,
      ...q.data()
    })) as QuizQuestion[]


  return {
    id: quizSnap.id,
    ...quizSnap.data(),
    questions
  } as Quiz

}
