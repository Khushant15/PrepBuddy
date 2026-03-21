import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message, mode } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY")
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002"
    })

    const prompt = `
You are an AI interview coach.

Interview type: ${mode}

Candidate answer:
${message}

Provide feedback and ask the next interview question.
`

    const result = await model.generateContent(prompt)

    const text = result.response.text()

    return NextResponse.json({ text })

  } catch (error) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      { text: "AI limit exceeded. Please try again later." },
      { status: 429 }
    )
  }
}