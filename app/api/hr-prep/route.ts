import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { question, context } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error("Missing GROQ_API_KEY")

    const groq = new Groq({ apiKey })

    const prompt = `
QUESTION: "${question}"
CONTEXT: "${context || "Candidate is applying for a tech role"}"

Generate a professional, structured "Model Answer" using the STAR method (Situation, Task, Action, Result) if applicable. 
Also provide 3 key tips on what interviewers are looking for in this specific answer.
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
    })

    const text = completion.choices[0]?.message?.content || "No advice found."

    return NextResponse.json({ text })

  } catch (error: any) {
    console.error("HR PREP ERROR:", error)
    return NextResponse.json(
      { text: "Could not generate model answer at this time." },
      { status: 500 }
    )
  }
}
