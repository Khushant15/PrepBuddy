import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { messages } = await req.json()
    
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
      return NextResponse.json({ strengths: [], weaknesses: [] })
    }

    const groq = new Groq({ apiKey })

    const analysisPrompt = `
      Analyze the following interview transcript between an AI Interviewer and a Candidate.
      Identify exactly 2-3 specific technical or behavioral STRENGTHS and 2-3 specific WEAKNESSES or areas for improvement.
      
      TRANSCRIPT:
      ${messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "strengths": ["string", "string"],
        "weaknesses": ["string", "string"]
      }
    `

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: analysisPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}")
    return NextResponse.json(result)

  } catch (error: any) {
    console.error("ANALYSIS ERROR:", error.message)
    return NextResponse.json({ strengths: [], weaknesses: [] })
  }
}
