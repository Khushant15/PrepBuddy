import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-server"
import axios from "axios"
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    // 1. Get Resume Profile from Request Body
    const { profile } = await req.json()
    
    if (!profile) {
      return NextResponse.json({ error: "No resume profile provided." }, { status: 400 })
    }

    // 👋 TECHNICAL FALLBACK HELPER
    const getMockJobs = (profile: any) => [
        {
          id: "int-mock-1",
          title: `Junior ${profile.primaryDomain || "Technical"} Engineer`,
          company: "TechNexus Alpha",
          score: 85,
          confidence: "High",
          domain_alignment: true,
          matched_project: profile.projects?.[0]?.name || "Core Skills",
          reason: `Direct alignment with your ${profile.primaryDomain} build experience.`,
          strengths: [`${profile.primaryDomain} Mastery (Matched via Project)`, "Vite optimization"],
          missing_skills: ["E2E Testing"],
          improvement_steps: ["Master Cypress Testing", "Implement CI/CD Gates", "Optimize Query Performance"],
          location: "Remote",
          type: "Internship"
        }
    ]

    // 2. Query TheirStack API (Verified working in Jobs route)
    const apiKey = process.env.THEIRSTACK_API_KEY
    if (!apiKey) throw new Error("Missing THEIRSTACK_API_KEY")

    console.log(`[INTELLIGENT] Querying TheirStack for Profile: ${profile.role}...`)

    // 👋 Technical Anchor Logic: We combine the extracted role with technical anchors 
    // to force the search engine into the correct job cluster (Engineering/IT).
    const techAnchors = ["Software", "Engineer", "Developer", "Analyst", "Tech"]
    const jobTitleOr = [profile.role, ...techAnchors.map(a => `${profile.role} ${a}`)]

    const queryPayload = {
      page: 0,
      limit: 6, // Reduced limit to save API credits (avoid E-007)
      posted_at_max_age_days: 45, 
      job_title_or: jobTitleOr.slice(0, 5) 
    }
    
    let rawJobs = []
    try {
      const response = await axios.post("https://api.theirstack.com/v1/jobs/search", 
        queryPayload,
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      )
      rawJobs = response.data.data || response.data.jobs || response.data.results || []
    } catch (err: any) {
       const isCreditError = err.response?.data?.error?.code === "E-007"
       console.error(`THEIRSTACK FETCH ERROR [Credit=${isCreditError}]:`, err.response?.data)
       if (isCreditError) {
         return NextResponse.json({
           error_type: "OUT_OF_CREDITS",
           jobs: getMockJobs(profile),
           tier: profile.tier,
           primary_domain: profile.primaryDomain,
           secondary_domain: profile.secondaryDomain
         })
       }
       throw err
    }
    
    // 🕵️ Hard Seniority & Level Filter
    // We immediately exclude roles that are clearly misaligned with an Entry/Junior profile.
    const excludedKeywords = ["senior", "lead", "staff", "principal", "architect", "phd", "manager", "head", "director"]
    const filteredJobs = rawJobs.filter((job: any) => {
      const title = (job.job_title || job.title || "").toLowerCase()
      // Always exclude high-seniority titles
      if (excludedKeywords.some(kw => title.includes(kw))) return false
      return true
    })

    // 3. Orchestrate Groq for Intelligent Matching (Parallel Analysis)
    const analyzedJobs = await Promise.all(
      filteredJobs.slice(0, 5).map(async (job: any) => {
        const jd = job.job_description || job.description || ""
        const prompt = `
          System: You are an expert Technical Career Strategist. Compare the candidate's professional matrix with the Job Description.
          
          CANDIDATE RELEVANCE RULES:
          - WEIGHTING: 70% PROJECT builds vs 30% Skills/Education.
          - MANDATORY ANCHORING: Every 'strength' MUST name the specific candidate project it came from (e.g., "React (Matched via Project X)").
          - NO HALLUCINATIONS: Suggest ONLY technologies explicitly mentioned in the resume or job description.
          - LEVEL APPROPRIATE: Candidate is ${profile.tier}. Suggest PRACTICAL entry-level growth (e.g., Hooks, API Integration) instead of senior topics like System Design or K8s.
          
          Candidate Domains: Primary: ${profile.primaryDomain}, Secondary: ${profile.secondaryDomain}
          Candidate Core Skills: ${profile.skills.join(", ")}
          Candidate Projects: ${JSON.stringify(profile.projects || [])}
          
          Job Title: ${job.job_title || job.title}
          Job Description Summary: ${jd.substring(0, 1000)}...
          
          Provide a JSON response with:
          - score: integer (0-100) based on 70% PROJECT weight.
          - confidence: string ("High", "Mid", "Low")
          - domain_alignment: boolean (Does it match Primary or Secondary domain?)
          - matched_project: string (name of the specific project that fits this JD best)
          - strengths: array of strings (must anchor to projects).
          - missing_skills: array of strings (specific tech gaps).
          - reason: string (1 concise sentence explaining project-to-JD fit).
          - improvement_steps: array of strings (3 actionable, entry-level steps).
          
          JSON ONLY. No whitespace outside JSON.
        `

        try {
          const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
          })

          const analysis = JSON.parse(completion.choices[0].message.content || "{}")
          
          return {
            id: job.id || job.job_id,
            title: job.job_title || job.title,
            company: job.company_name || job.company?.name || "Premium Tech",
            logo: job.company_logo_url || job.company?.logo_url,
            location: job.job_location || `${job.location?.city || "Remote"}, ${job.location?.country_code || "Global"}`,
            applyLink: job.url || job.apply_url || "#",
            type: job.job_type || "Full-time",
            ...analysis
          }
        } catch (e) {
          console.error("GROQ ANALYZE ERROR:", e)
          return null
        }
      })
    )

    // 4. Significance Filter & Post-Analysis Cleanup
    const highRelevanceJobs = analyzedJobs.filter(j => j && j.score >= 50)
    
    return NextResponse.json({
      jobs: highRelevanceJobs,
      high_relevance: highRelevanceJobs.length > 0,
      tier: profile.tier,
      primary_domain: profile.primaryDomain,
      secondary_domain: profile.secondaryDomain,
      total_analyzed: analyzedJobs.length
    })

  } catch (error: any) {
    const detail = error.response?.data ? JSON.stringify(error.response.data) : error.message
    console.error(`INTELLIGENT JOBS ERROR:`, detail)
    
    return NextResponse.json([
        {
          id: "int-mock-1",
          title: "Junior Frontend Engineer",
          company: "TechNexus",
          score: 85,
          confidence: "High",
          matched_project: "Personal Portfolio",
          reason: "Direct alignment with your React/Tailwind project experience.",
          strengths: ["Modern UI implementation", "Vite optimization"],
          missing_skills: ["E2E Testing"],
          improvement_roadmap: ["Cypress Fundamentals"],
          location: "Remote",
          type: "Internship"
        }
    ])
  }
}
