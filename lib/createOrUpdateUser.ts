import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { User } from "firebase/auth"

export const createOrUpdateUser = async (user: User) => {
  const userRef = doc(db, "users", user.uid)

  await setDoc(
    userRef,
    {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  )
}