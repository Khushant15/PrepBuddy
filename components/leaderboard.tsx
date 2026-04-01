"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal, Loader, User, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  getCountFromServer, 
  where 
} from "firebase/firestore"

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  score: number // This will be XP
  percentage: number // This will be Accuracy
  attempts: number // This will be totalAttempted
  badge?: "gold" | "silver" | "bronze"
}

const getBadgeIcon = (badge?: "gold" | "silver" | "bronze") => {
  switch (badge) {
    case "gold":
      return <Trophy size={18} className="text-yellow-500" />
    case "silver":
      return <Medal size={18} className="text-slate-400" />
    case "bronze":
      return <Medal size={18} className="text-orange-600" />
    default:
      return null
  }
}

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!db) return
      
      try {
        setLoading(true)
        
        // 1. Fetch Top 10 users primarily by XP
        const usersRef = collection(db, "users")
        const topQuery = query(usersRef, orderBy("xp", "desc"), limit(10))
        const snapshot = await getDocs(topQuery)
        
        const topUsers = snapshot.docs.map((doc, index) => {
          const data = doc.data()
          const accuracy = data.totalAttempted > 0 
            ? Math.round((data.totalCorrect / data.totalAttempted) * 100) 
            : 0
            
          return {
            rank: index + 1,
            userId: doc.id,
            name: data.displayName || data.email?.split("@")[0] || "Explorer",
            score: data.xp || 0,
            percentage: accuracy,
            attempts: data.totalAttempted || 0,
            badge: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : undefined
          } as LeaderboardEntry
        })
        
        setLeaderboardData(topUsers)

        // 2. Calculate current user's global rank
        const currentUser = auth?.currentUser
        if (currentUser) {
            // Check if user is already in top 10
            const topIndex = topUsers.findIndex(u => u.userId === currentUser.uid)
            if (topIndex !== -1) {
                setUserRank(topIndex + 1)
            } else {
                // If not in top 10, count how many have more XP than current user
                const userDoc = await getDocs(query(usersRef, where("__name__", "==", currentUser.uid)))
                const userXp = userDoc.docs[0]?.data()?.xp || 0
                
                const rankQuery = query(usersRef, where("xp", ">", userXp))
                const rankSnap = await getCountFromServer(rankQuery)
                setUserRank(rankSnap.data().count + 1)
            }
        }

      } catch (error) {
        console.error("Leaderboard Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
      return (
          <Card className="p-8 border-border/50 bg-card/50 flex flex-col items-center justify-center min-h-[400px]">
              <Loader className="animate-spin text-primary mb-4" size={32} />
              <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Neural Leaderboard Syncing...</p>
          </Card>
      )
  }

  return (
    <Card className="p-6 border-border/50 bg-card/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
          <Trophy size={140} />
      </div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
            <h2 className="text-xl font-black italic tracking-tight">Global Rankings</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Live Feed - All Time</p>
        </div>
        <div className="flex gap-1">
          {["All Time"].map((period) => (
            <div
              key={period}
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 border-primary/20 bg-primary/5 text-primary transition-colors"
            >
              {period}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {leaderboardData.length === 0 ? (
            <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-primary/20 mb-4" />
                <p className="text-sm font-bold text-muted-foreground">Neural sequence empty. No users found.</p>
            </div>
        ) : (
            leaderboardData.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                  entry.rank <= 3
                    ? "bg-primary/5 border-primary/20 shadow-xl"
                    : "bg-card/40 border-primary/5 hover:border-primary/10"
                }`}
              >
                {/* Rank */}
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 font-black text-sm">
                  {entry.badge ? getBadgeIcon(entry.badge) : `#${entry.rank}`}
                </div>
    
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <p className="font-black text-sm text-foreground truncate uppercase tracking-tight">{entry.name}</p>
                     {entry.userId === auth?.currentUser?.uid && (
                         <span className="text-[8px] font-black uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded">You</span>
                     )}
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 italic">{entry.attempts} Quests</p>
                </div>
    
                {/* Score */}
                <div className="text-right shrink-0">
                  <p className="font-black text-primary text-sm italic">{entry.score} XP</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">{entry.percentage}% Accuracy</p>
                </div>
              </div>
            ))
        )}
      </div>

      {userRank && (
          <div className="mt-8 pt-6 border-t border-primary/10 text-center relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <User size={14} className="text-primary" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Your Global Standing: <span className="text-white italic">Rank #{userRank}</span>
                  </span>
              </div>
          </div>
      )}
    </Card>
  )
}
