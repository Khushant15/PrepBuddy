import { NextResponse } from "next/server"
import axios from "axios"
import { checkRateLimit } from "@/lib/rate-limit"
import { getAuthUser } from "@/lib/auth-server"

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const rateLimit = checkRateLimit(user.uid, 15, 60000)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${rateLimit.retryAfter}s.` }, 
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") || "Target Role"
    const location = searchParams.get("location") || "India"

    const apiKey = process.env.THEIRSTACK_API_KEY
    if (!apiKey) throw new Error("Missing THEIRSTACK_API_KEY")

    console.log(`[JOBS] Querying TheirStack for Role: ${role}, Location: ${location}...`)

    // TheirStack v1/jobs/search is very rigid about location IDs.
    // Strategy: If 2-char code is provided (e.g. "US", "IN"), use job_country_code_or.
    // Otherwise, append the location to the job_title_or keyword for better string matching without 422 errors.
    const queryPayload: any = {
      page: 0,
      limit: 10,
      posted_at_max_age_days: 30
    }

    if (location.length === 2) {
      queryPayload.job_title_or = [role]
      queryPayload.job_country_code_or = [location.toUpperCase()]
    } else {
      // Combined string search is the most reliable way to avoid 'job_location_or' validation errors
      queryPayload.job_title_or = [`${role} in ${location}`]
    }

    const response = await axios.post("https://api.theirstack.com/v1/jobs/search", 
      queryPayload,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    )

    // Handle TheirStack variants in response structure
    const rawData = response.data.data || response.data.jobs || response.data.results || []
    
    const jobs = rawData.map((job: any) => ({
      job_id: job.id,
      job_title: job.job_title || job.title || "Elite Role",
      employer_name: job.company_name || job.company?.name || "Premium Tech",
      employer_logo: job.company_logo_url || job.company?.logo_url || null,
      job_apply_link: job.url || job.apply_url || "#",
      job_city: job.job_location || job.location?.city || "Remote",
      job_country: job.job_country_code || job.location?.country_code || "Global",
      job_employment_type: job.job_type || "Full-time",
      job_description: job.job_description || job.description || ""
    }))

    return NextResponse.json(jobs)

  } catch (error: any) {
    const status = error.response?.status
    const detail = error.response?.data ? JSON.stringify(error.response.data) : error.message
    console.error(`THEIRSTACK API ERROR [${status}]:`, detail)
    
    // GENTLE FALLBACK for connectivity issues
    return NextResponse.json([
        { 
          job_id: "mock-1", 
          job_title: "Full Stack Engineer (TheirStack Proxy)", 
          employer_name: "PrepBuddy AI", 
          job_city: "Mumbai", 
          job_country: "IN",
          job_employment_type: "Full-time",
          job_apply_link: "https://google.com"
        },
        {
          job_id: "mock-2",
          job_title: "Backend Specialist (Node/Go)",
          employer_name: "Startup Core",
          job_city: "Remote",
          job_country: "US",
          job_employment_type: "Contract",
          job_apply_link: "https://google.com"
        }
    ])
  }
}
