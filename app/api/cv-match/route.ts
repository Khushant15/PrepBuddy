import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { resumeData, jobData } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error("Missing GROQ_API_KEY")

    const groq = new Groq({ apiKey })

    const prompt = `
Resume Data: ${JSON.stringify(resumeData)}
Job Data: ${JSON.stringify(jobData)}

Compare the candidate's resume against the job requirements.
Calculate a "Match Score" from 0-100.
Identify matching skills, missing skills, and provide 3 specific optimization suggestions.
Return ONLY a valid JSON object:
{
  "score": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "suggestions": string[]
}
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    const data = JSON.parse(completion.choices[0]?.message?.content || "{}")

    return NextResponse.json(data)

  } catch (error: any) {
    console.error("CV MATCH ERROR:", error)
    return NextResponse.json(
      { error: "Could not calculate match score." },
      { status: 500 }
    )
  }
}
