import { db, auth } from "./firebase"
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  collection, 
  addDoc,
  serverTimestamp,
  query, 
  orderBy, 
  limit, 
  getDocs, 
  where,
  onSnapshot,
  getCountFromServer,
  collectionGroup,
  Timestamp
} from "firebase/firestore"

// Helper to handle Firestore errors gracefully across the app
const safeFirestore = async (fn: () => Promise<any>, fallback: any = null) => {
    try {
        return await fn()
    } catch (err) {
        console.error("Firestore Operation Failed:", err)
        return fallback
    }
}

// LocalStorage Persistence Fallback for Elite Resilience
const syncToLocal = (key: string, data: any) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(`prepbuddy_${key}`, JSON.stringify(data))
    }
}

const getFromLocal = (key: string) => {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem(`prepbuddy_${key}`)
        return data ? JSON.parse(data) : null
    }
    return null
}

export const initializeProgress = async () => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        xp: 0,
        level: 1,
        streak: 0,
        lastActive: serverTimestamp(),
        quizzesCompleted: 0,
        questionsAnswered: 0,
        accuracy: 0,
        totalCorrect: 0,
        totalAttempted: 0,
        weeklyTarget: 0,
        skills: [],
      })
    }
  })
}

export const getUserProgress = async () => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return getFromLocal("userProgress")

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const userSnap = await getDoc(userRef)
    const data = userSnap.exists() ? userSnap.data() : null
    if (data) syncToLocal("userProgress", data)
    return data || getFromLocal("userProgress")
  })
}

// ✅ Subscribe to Real-Time Progress
export const subscribeToUserProgress = (callback: (data: any) => void) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return () => {}

  const userRef = doc(firestore, "users", user.uid)
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      syncToLocal("userProgress", data)
      callback(data)
    }
  })
}

// ✅ Log User Activity for Analytics
export const logActivity = async (type: "quiz" | "interview" | "lesson" | "roadmap", metadata: any) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return

  return safeFirestore(async () => {
    const activityRef = collection(firestore, "users", user.uid, "activityLogs")
    await addDoc(activityRef, {
      type,
      ...metadata,
      timestamp: Timestamp.now()
    })
  })
}

// ✅ Calculate Global Rank
export const getGlobalRank = async () => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return null

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const userSnap = await getDoc(userRef)
    const userXp = userSnap.data()?.xp || 0

    const usersRef = collection(firestore, "users")
    const rankQuery = query(usersRef, where("xp", ">", userXp))
    const rankSnap = await getCountFromServer(rankQuery)
    return rankSnap.data().count + 1
  })
}

// ✅ Get Total Lessons (Roadmap Stages) Completed
export const getTotalLessonsCompleted = async () => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return 0

    return safeFirestore(async () => {
        const roadmapHistoryRef = collection(firestore, "users", user.uid, "roadmapHistory")
        const snapshot = await getDocs(roadmapHistoryRef)
        let total = 0
        snapshot.forEach(doc => {
            total += (doc.data().completedStages || []).length
        })
        return total
    }, 0)
}

// ✅ Save Quiz History & Update Stats
export const saveQuizProgress = async (quizId: string, score: number, total: number) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const historyRef = collection(userRef, "quizHistory")

    await addDoc(historyRef, {
      quizId,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      completedAt: Timestamp.now(),
    })

    const xpGain = score * 10
    await updateDoc(userRef, {
      xp: increment(xpGain),
      quizzesCompleted: increment(1),
      questionsAnswered: increment(total),
      totalCorrect: increment(score),
      totalAttempted: increment(total),
      lastActive: serverTimestamp(),
    })
    
    // Log Activity for Charts
    await logActivity("quiz", { quizId, score, percentage: Math.round((score / total) * 100) })

    const updatedSnap = await getDoc(userRef)
    const data = updatedSnap.data()
    if (data) {
      const newLevel = Math.floor(data.xp / 250) + 1
      if (newLevel > data.level) {
        await updateDoc(userRef, { level: newLevel })
      }
    }
  })
}

// ✅ Save Interview History
export const saveInterviewProgress = async (type: string, score: number, feedback: any[]) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const historyRef = collection(userRef, "interviewHistory")

    await addDoc(historyRef, {
      type,
      score,
      feedback,
      completedAt: Timestamp.now(),
    })

    await updateDoc(userRef, {
      xp: increment(50),
      lastActive: serverTimestamp(),
    })

    // Log Activity for Charts
    await logActivity("interview", { type, score })
  })
}

// ✅ Update FCM Token
export const updateFCMToken = async (token: string) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    await updateDoc(userRef, {
      fcmToken: token,
    })
  })
}

// ✅ Get Interview History
export const getInterviewHistory = async (roleFilter?: string) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return []

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const historyRef = collection(userRef, "interviewHistory")
    
    let q;
    if (roleFilter) {
      q = query(
          historyRef, 
          where("type", "==", roleFilter),
          orderBy("completedAt", "desc"), 
          limit(20)
      )
    } else {
      q = query(historyRef, orderBy("completedAt", "desc"), limit(20))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().completedAt?.toDate()
    }))
  }, [])
}

// ✅ Save Roadmap Progress
export const saveRoadmapProgress = async (roadmapId: string, stageIndex: number, isCompleted: boolean) => {
  const user = auth?.currentUser
  const firestore = db
  if (!user || !firestore) return

  return safeFirestore(async () => {
    const userRef = doc(firestore, "users", user.uid)
    const roadmapRef = doc(userRef, "roadmapHistory", roadmapId)

    const roadmapSnap = await getDoc(roadmapRef)
    let completedStages: number[] = []

    if (roadmapSnap.exists()) {
      completedStages = roadmapSnap.data().completedStages || []
      if (isCompleted) {
        if (!completedStages.includes(stageIndex)) completedStages.push(stageIndex)
      } else {
        completedStages = completedStages.filter((i: number) => i !== stageIndex)
      }
      await updateDoc(roadmapRef, {
        completedStages,
        lastUpdated: serverTimestamp()
      })
    } else {
      await setDoc(roadmapRef, {
        completedStages: isCompleted ? [stageIndex] : [],
        lastUpdated: serverTimestamp()
      })
    }

    if (isCompleted) {
      await updateDoc(userRef, {
          xp: increment(10),
          lastActive: Timestamp.now()
      })
      // Log as Lesson completion
      await logActivity("lesson", { roadmapId, stageIndex })
    }
  })
}

// ✅ Get Roadmap Progress
export const getRoadmapProgress = async (roadmapId: string) => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return []

    return safeFirestore(async () => {
        const roadmapRef = doc(firestore, "users", user.uid, "roadmapHistory", roadmapId)
        const roadmapSnap = await getDoc(roadmapRef)
        return roadmapSnap.exists() ? roadmapSnap.data().completedStages : []
    }, [])
}

// ✅ Update Skill Profile (For Interview Memory)
export const updateSkillProfile = async (strengths: string[], weaknesses: string[]) => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return

    return safeFirestore(async () => {
        const userRef = doc(firestore, "users", user.uid)
        const userSnap = await getDoc(userRef)
        const current = userSnap.data()?.skillProfile || { strengths: [], weaknesses: [] }

        const newStrengths = Array.from(new Set([...(current.strengths || []), ...strengths])).slice(-5)
        const newWeaknesses = Array.from(new Set([...(current.weaknesses || []), ...weaknesses])).slice(-5)

        await updateDoc(userRef, {
            skillProfile: {
                strengths: newStrengths,
                weaknesses: newWeaknesses,
                lastUpdated: serverTimestamp()
            }
        })
    })
}

// ✅ Get Skill Profile
export const getSkillProfile = async () => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return null
    return safeFirestore(async () => {
        const userRef = doc(firestore, "users", user.uid)
        const userSnap = await getDoc(userRef)
        return userSnap.exists() ? userSnap.data().skillProfile : null
    })
}

// ✅ Save Resume Profile (Extracted from Affinda)
export const saveResumeProfile = async (profileData: any) => {
    const user = auth?.currentUser
    const firestore = db
    if (!user) {
        syncToLocal("resumeProfile", profileData)
        return
    }

    syncToLocal("resumeProfile", profileData) // Mirror to local
    if (!firestore) return

    return safeFirestore(async () => {
        const userRef = doc(firestore, "users", user.uid)
        await updateDoc(userRef, {
            resumeProfile: {
                ...profileData,
                lastUpdated: serverTimestamp()
            }
        })
    })
}

// ✅ Get Resume Profile
export const getResumeProfile = async () => {
    const user = auth?.currentUser
    const firestore = db
    const local = getFromLocal("resumeProfile")
    if (!user || !firestore) return local

    return safeFirestore(async () => {
        const userRef = doc(firestore, "users", user.uid)
        const userSnap = await getDoc(userRef)
        const data = userSnap.exists() ? userSnap.data()?.resumeProfile : null
        if (data) syncToLocal("resumeProfile", data)
        return data || local
    }, local)
}

// ✅ Save Intelligent Job Matches
export const saveJobMatches = async (matches: any[]) => {
    const user = auth?.currentUser
    const firestore = db
    syncToLocal("intelligentMatches", matches)
    if (!user || !firestore) return

    return safeFirestore(async () => {
        const userRef = doc(firestore, "users", user.uid)
        await updateDoc(userRef, {
            intelligentMatches: matches,
            lastMatchUpdate: serverTimestamp()
        })
    })
}

// ✅ Get Intelligent Job Matches
export const getIntelligentMatches = async () => {
    const user = auth?.currentUser
    const firestore = db
    const local = getFromLocal("intelligentMatches")
    if (!user || !firestore) return local || []

    return safeFirestore(async () => {
        const userRef = doc(firestore, "users", user.uid)
        const userSnap = await getDoc(userRef)
        const data = userSnap.exists() ? userSnap.data()?.intelligentMatches || [] : []
        if (data?.length > 0) syncToLocal("intelligentMatches", data)
        return data.length > 0 ? data : (local || [])
    }, local || [])
}

// ✅ Get Quiz History
export const getQuizHistory = async () => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return []

    return safeFirestore(async () => {
        const historyRef = collection(firestore, "users", user.uid, "quizHistory")
        const q = query(historyRef, orderBy("completedAt", "desc"), limit(50))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            completedAt: doc.data().completedAt?.toDate()
        }))
    }, [])
}

// ✅ Get Activity Logs for Charts
export const getActivityLogs = async (days: number = 7) => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return []

    return safeFirestore(async () => {
        const logsRef = collection(firestore, "users", user.uid, "activityLogs")
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        
        const q = query(
            logsRef, 
            where("timestamp", ">=", cutoff),
            orderBy("timestamp", "asc")
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        }))
    }, [])
}

// ✅ Get All Roadmap History
export const getRoadmapHistory = async () => {
    const user = auth?.currentUser
    const firestore = db
    if (!user || !firestore) return []

    return safeFirestore(async () => {
        const roadmapHistoryRef = collection(firestore, "users", user.uid, "roadmapHistory")
        const snapshot = await getDocs(roadmapHistoryRef)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    }, [])
}
