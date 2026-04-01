import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId || !db) throw new Error("Missing parameters")

    const userRef = doc(db, "users", userId)
    const userSnap = await getDocs(query(collection(db, "users"), where("__name__", "==", userId)))
    
    if (userSnap.empty) throw new Error("User not found")
    const userData = userSnap.docs[0].data()

    // 1. Fetch matching jobs from JSearch based on user skills
    const skills = userData.skills || ["Professional Candidate"]
    const jobQuery = skills.slice(0, 3).join(" ")
    
    const rapidKey = process.env.RAPID_API_KEY
    const jobRes = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: { query: jobQuery, page: "1", num_pages: "1" },
      headers: { "x-rapidapi-key": rapidKey, "x-rapidapi-host": "jsearch.p.rapidapi.com" }
    })

    const matchingJobs = jobRes.data.data || []

    // 2. Alert logic (If matching jobs found, pseudo-simulate alert)
    if (matchingJobs.length > 0) {
        await updateDoc(userRef, {
            lastJobAlert: serverTimestamp()
        })
    }

    return NextResponse.json({ 
        jobsFound: matchingJobs.length,
        notificationTriggered: matchingJobs.length > 0 
    })

  } catch (error: any) {
    console.error("JOB NOTIFY ERROR:", error.message)
    return NextResponse.json({ error: "Failed to process job alerts" }, { status: 500 })
  }
}
