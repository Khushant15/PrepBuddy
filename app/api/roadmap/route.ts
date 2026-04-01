import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { role, company, experience } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error("Missing GROQ_API_KEY")

    const groq = new Groq({ apiKey })

    const prompt = `
Generate a 4-stage technical interview preparation roadmap for a ${role} position at ${company || "a top-tier tech firm"} with ${experience || "0-2 years"} of experience.
Return ONLY a valid JSON object with the following structure:
{
  "title": "Roadmap Title",
  "role": "Role Name",
  "company": "Company Name",
  "duration": "Total days/weeks",
  "stages": [
    {
      "id": "stage-uuid",
      "title": "Stage Title",
      "duration": "e.g. 3 days",
      "topics": ["topic 1", "topic 2"],
      "resources": [{"name": "Resource Name", "url": "URL"}]
    }
  ]
}
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" }
    })

    const data = JSON.parse(completion.choices[0]?.message?.content || "{}")

    return NextResponse.json(data)

  } catch (error: any) {
    console.error("ROADMAP ERROR:", error)
    return NextResponse.json(
      { error: "Could not generate roadmap at this time." },
      { status: 500 }
    )
  }
}
