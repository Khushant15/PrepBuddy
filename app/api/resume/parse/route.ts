import { AffindaAPI } from "@affinda/affinda"
import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-server"
import { adminDb } from "@/lib/firebase-admin"
import * as admin from "firebase-admin"

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as Blob
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const apiKey = process.env.AFFINDA_API_KEY
    const workspaceId = process.env.AFFINDA_WORKSPACE_ID
    if (!apiKey) throw new Error("Missing AFFINDA_API_KEY")
    if (!workspaceId) throw new Error("Missing AFFINDA_WORKSPACE_ID")

    const { AffindaCredential } = await import("@affinda/affinda")
    const client = new AffindaAPI(new AffindaCredential(apiKey))

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload and Parse
    const result = await client.createDocument({
      file: buffer,
      fileName: "resume.pdf",
      workspace: workspaceId,
    }) as any

    const extracted = result.data || {}
    
    // 🕵️ 'Skill-Primary' Extraction Logic
    // We ignore the generic "profession" field from the AI to avoid noise (like nursing leaks).
    // Instead, we derive the professional role exclusively from technical anchors found in the Skill sections.
    const rawText = JSON.stringify(extracted).toLowerCase()
    
    // 🛠️ Deep Skill & Tools Extraction
    const baseSkills = extracted.skills?.map((s: any) => s.name) || []
    const domainKeywords = ["full stack", "fullstack", "frontend", "backend", "cloud", "artificial intelligence", "ai", "machine learning", "devops", "mobile", "ui/ux"]
    const foundDomains = domainKeywords.filter(d => rawText.includes(d))
    const skills = Array.from(new Set([...baseSkills, ...foundDomains]))

    // 🛠️ Score-Based Domain Detection Matrix
    const domainScores = {
      Frontend: 0,
      FullStack: 0,
      AI: 0,
      Mobile: 0
    }

    // Scoring logic (1pt per matched tech)
    if (rawText.includes("react") || rawText.includes("next.js") || rawText.includes("tailwind") || rawText.includes("frontend")) domainScores.Frontend++
    if (rawText.includes("node") || rawText.includes("express") || rawText.includes("mongodb") || rawText.includes("sql") || rawText.includes("backend")) domainScores.FullStack++
    if (rawText.includes("python") || rawText.includes("pytorch") || rawText.includes("tensorflow") || rawText.includes(" ml ") || rawText.includes(" ai ")) domainScores.AI++
    if (rawText.includes("flutter") || rawText.includes("react native") || rawText.includes("kotlin") || rawText.includes("android")) domainScores.Mobile++

    const sortedDomains = Object.entries(domainScores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0)
      .map(([name]) => name)

    const primaryDomain = sortedDomains[0] || "Software Engineering"
    const secondaryDomain = sortedDomains[1] || "Full Stack"

    // 🎯 Professional Role Logic (Clean naming)
    let derivedRole = primaryDomain + " Developer"
    if (primaryDomain.toLowerCase().includes("engineer") || primaryDomain.toLowerCase().includes("stack")) {
      derivedRole = primaryDomain
    }
    const projects = extracted.projects?.map((p: any) => ({
      name: p.name || p.title || "Project",
      description: p.description || ""
    })) || []

    const yearsExp = extracted.totalYearsExperience || 0
    const projectCount = projects.length
    
    // 📊 3-Tier Level Classification Logic
    let careerTier = "Entry"
    if (yearsExp >= 2 || projectCount >= 4) {
      careerTier = "Junior"
    } else if (yearsExp >= 1 || projectCount >= 3) {
      careerTier = "Entry-Junior Hybrid"
    }

    const profileData = {
      role: primaryDomain + " Developer",
      primaryDomain,
      secondaryDomain,
      tier: careerTier,
      skills: skills.slice(0, 20),
      projects: projects,
      experience: yearsExp,
      education: extracted.education?.map((e: any) => e.degree?.value) || [],
      parsedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true,
      profile: profileData
    })

  } catch (error: any) {
    console.error("AFFINDA PARSE ERROR:", error)
    return NextResponse.json(
      { error: "Resume parsing failed" },
      { status: 500 }
    )
  }
}
