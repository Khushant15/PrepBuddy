import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, updateDoc, doc, Timestamp, serverTimestamp } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // CRON AUTH CHECK (Optional: Verify X-CRON-AUTH header from Vercel)
  
  try {
    if (!db) throw new Error("Database not initialized")

    const usersRef = collection(db, "users")
    
    // 1. Find users who haven't been active in 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    
    const inactiveQuery = query(
      usersRef, 
      where("lastActive", "<", Timestamp.fromDate(oneDayAgo))
    )
    
    const snapshot = await getDocs(inactiveQuery)
    const results = []

    for (const userDoc of snapshot.docs) {
      const data = userDoc.data()
      
      // 2. Throttling: Check if already notified recently
      const lastNotified = data.lastNotified?.toDate() || new Date(0)
      const hoursSinceLastNotify = (new Date().getTime() - lastNotified.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastNotify >= 24) {
        // Send Notification (Pseudo - logic to trigger Firebase Messaging via Admin SDK)
        // Since we are in Edge/Serverless, we'd trigger a cloud function or use ApyHub as requested
        
        // FOR NOW: Record the notification event
        await updateDoc(doc(db, "users", userDoc.id), {
          lastNotified: serverTimestamp(),
          notificationsSent: (data.notificationsSent || 0) + 1
        })
        
        results.push({ id: userDoc.id, status: "notified" })
      }
    }

    return NextResponse.json({ processed: results.length, details: results })

  } catch (error: any) {
    console.error("STREAK NOTIFY ERROR:", error.message)
    return NextResponse.json({ error: "Failed to process streak alerts" }, { status: 500 })
  }
}
