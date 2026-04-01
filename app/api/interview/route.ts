import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { getAuthUser } from "@/lib/auth-server"

const FALLBACK_QUESTIONS = [
  "Good response. Now, tell me about a time you had to deal with a difficult technical challenge and how you solved it.",
  "Interesting approach. How do you handle situations where you disagree with your team or manager's decision?",
  "Makes sense. What is your process for learning a new technology or framework under a tight deadline?",
  "Let's move on. Why are you interested in this specific role and our company's mission?",
  "Can you describe a situation where you went above and beyond for a project or client?",
  "Lastly, where do you see your career heading in the next 3 to 5 years?"
]

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })

    const rateLimit = checkRateLimit(user.uid, 15, 60000)
    if (!rateLimit.success) return NextResponse.json({ error: `Quota exceeded.` }, { status: 429 })

    const { messages, mode, resume, skillProfile } = await req.json()
    
    // Ensure we have a valid conversation message for the AI
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: "I'm ready to begin. Could you introduce yourself?" })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
        const randomQ = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)]
        return NextResponse.json({ text: `(Offline Mode) ${randomQ}` })
    }

    const groq = new Groq({ apiKey })

    const systemPrompt = `
You are an expert ${mode || "Career Professional"} interviewer for a top-tier firm.
Your goal is to conduct a professional, challenging, yet encouraging interview.

${skillProfile ? `PAST PERFORMANCE: The candidate has previously shown 
STRENGTHS: ${skillProfile.strengths?.join(", ") || "None recorded"}
WEAKNESSES: ${skillProfile.weaknesses?.join(", ") || "None recorded"}
ADAPTIVE RULE: Proactively test their growth in these weaknesses during this session.` : ""}

${resume ? `CONTEXT: The candidate has provided the following resume details: ${JSON.stringify(resume)}` : ""}

RULES:
1. Provide constructive, brief feedback on their previous answer if applicable.
2. Ask ONE follow-up or new question at a time.
3. If the candidate asks for help, provide a subtle hint but keep the interview going.
4. Maintain a formal yet supportive tone.
5. Keep your total response under 200 words.
`

    // Map conversation history to Groq format
    const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
            role: m.role,
            content: m.content || "..." // Fix for empty content error
        }))
    ]

    try {
        const completion = await groq.chat.completions.create({
            messages: groqMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024
        }, {
            timeout: 15000
        })

        const text = completion.choices[0]?.message?.content || "I'm having trouble thinking of the next question. Could you repeat your last point?"
        return NextResponse.json({ text })

    } catch (apiError: any) {
        console.error("GROQ API ERROR:", apiError.message)
        const randomQ = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)]
        return NextResponse.json({ text: `(Coach is warming up) ${randomQ}` })
    }

  } catch (error: any) {
    console.error("AI INTERVIEW CRITICAL ERROR:", error.message)
    return NextResponse.json({ text: "AI Coach is currently busy. Please try again." }, { status: 500 })
  }
}