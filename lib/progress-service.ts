"use client"

import { db, auth } from "@/lib/firebase"
import {
doc,
setDoc,
getDoc,
increment,
serverTimestamp,
arrayUnion,
} from "firebase/firestore"

// GET USER PROGRESS
export const getUserProgress = async () => {

const user = auth.currentUser
if (!user) return null

const ref = doc(db, "progress", user.uid)
const snap = await getDoc(ref)

if (!snap.exists()) return null

const data = snap.data()

// auto calculate level
const level = Math.floor((data.xp || 0) / 100)

return {
...data,
level,
}
}

// INITIALIZE USER PROGRESS (RUNS ONLY ONCE)
export const initializeProgress = async () => {

const user = auth.currentUser
if (!user) return

const ref = doc(db, "progress", user.uid)

const snap = await getDoc(ref)

// 🔥 only create if document does not exist
if (!snap.exists()) {

await setDoc(ref, {
  quizzesCompleted: 0,
  questionsAnswered: 0,
  completedTopics: [],
  lastTopic: "",
  xp: 0,
  level: 0,
  streak: 0,
  bestStreak: 0,
  weeklyTarget: 10,
  lastActive: serverTimestamp(),
})


}
}

// SAVE QUIZ COMPLETION
export const saveQuizProgress = async (
topic: string,
score: number,
questionsCount: number
) => {

const user = auth.currentUser
if (!user) return

const xpEarned = score * 10
const ref = doc(db, "progress", user.uid)

await setDoc(
ref,
{
quizzesCompleted: increment(1),
questionsAnswered: increment(questionsCount),
xp: increment(xpEarned),
completedTopics: arrayUnion(topic),
lastTopic: topic,
lastActive: serverTimestamp(),
},
{ merge: true }
)
}

// SAVE LEARNING PROGRESS
export const saveLearningProgress = async (topic: string) => {

const user = auth.currentUser
if (!user) return

const ref = doc(db, "progress", user.uid)

await setDoc(
ref,
{
completedTopics: arrayUnion(topic),
lastTopic: topic,
xp: increment(20),
lastActive: serverTimestamp(),
},
{ merge: true }
)
}

// UPDATE STREAK
export const updateStreak = async () => {

const user = auth.currentUser
if (!user) return

const ref = doc(db, "progress", user.uid)

await setDoc(
ref,
{
streak: increment(1),
bestStreak: increment(1),
lastActive: serverTimestamp(),
},
{ merge: true }
)
}
