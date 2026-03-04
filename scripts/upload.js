import dotenv from "dotenv"
import fs from "fs"

import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"

dotenv.config({ path: ".env.local" })

// Load JSON manually
const quizzes = JSON.parse(
  fs.readFileSync("./data/quizzes.json", "utf-8")
)

const questionsData = JSON.parse(
  fs.readFileSync("./data/questions.json", "utf-8")
)

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function upload() {
  for (const quiz of quizzes) {
    console.log("Uploading quiz:", quiz.id)

    await setDoc(doc(db, "quizzes", quiz.id), quiz)

    const quizQuestions = questionsData[quiz.id]

    if (!quizQuestions) {
      console.log("No questions found for:", quiz.id)
      continue
    }

    for (const question of quizQuestions) {
      console.log("Uploading question:", question.id)

      await setDoc(
        doc(db, "quizzes", quiz.id, "questions", question.id),
        question
      )
    }
  }

  console.log("Upload complete ✅")
}

upload().catch(console.error)