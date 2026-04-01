import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"
import { companyQuestionMap } from "@/lib/company-questions"

export async function POST(req: Request) {
  try {
    const { company, role } = await req.json()
    if (!company) return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    
    const userRole = role || "Professional Role"
    const searchKey = company.toLowerCase().trim()
    
    // Initialize grouped categories
    const categories: Record<string, any[]> = {
      "Technical": [],
      "System Design": [],
      "Role-Based": [],
      "Conceptual": [],
      "HR / Behavioral": [],
      "Rapid Fire MCQs": [],
      "Debugging": [],
      "Interview Experiences": []
    }

    // 1. Load Local Data (if available)
    if (companyQuestionMap[searchKey]) {
      const curated = companyQuestionMap[searchKey]
      
      // If curated is an object with 'coding' key (e.g. Accenture)
      if (curated.coding) {
        categories["Technical"] = curated.coding.map((q: any) => ({
          question: q.title || q.description,
          description: q.description || "",
          difficulty: q.difficulty || "Medium",
          answer: q.answer || "Refactor and optimize the solution using standard DSA patterns.",
          tags: q.tags || []
        }))
      } 
      // If curated is a flat array (e.g. TCS)
      else if (Array.isArray(curated)) {
        categories["Technical"] = curated.map((q: any) => ({
            question: q.title || q.description,
            description: q.description || "",
            difficulty: q.difficulty || "Medium",
            answer: q.answer || "Discuss your approach and complexity analysis.",
            tags: q.tags || []
        }))
      }
    }

    // 2. Generate AI content for all 8 categories via Groq
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error("Missing GROQ_API_KEY")

    const groq = new Groq({ apiKey })

    const prompt = `
Generate a comprehensive interview question bank for ${company} for the position of ${userRole}.
Provide 3 questions for EACH of the following categories. 
Return ONLY a valid JSON object where keys are the category names exactly as specified:

1. "Technical": Real coding/DSA challenges.
2. "System Design": Scalability, LLD, and HLD scenarios.
3. "Role-Based": Specific to ${userRole} (e.g. React hooks for Frontend, K8s for DevOps).
4. "Conceptual": Core OS, Networking, DBMS, or language internals.
5. "HR / Behavioral": Company culture, conflict resolution, and leadership.
6. "Rapid Fire MCQs": Short, tricky multiple choice questions.
7. "Debugging": Give a buggy code snippet or a broken system scenario to fix.
8. "Interview Experiences": Succinct, bulleted summaries of recent real-world interview loops at ${company}.

Each question object MUST have:
{
  "question": "Clear question title or text",
  "description": "Context or snippet",
  "difficulty": "Easy" | "Medium" | "Hard",
  "answer": "Concise ideal response or solution",
  "tags": ["Tag1", "Tag2"]
}

Return JSON with "categories" as the root key.
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      response_format: { type: "json_object" }
    })

    const aiContent = JSON.parse(completion.choices[0]?.message?.content || "{}")
    const aiCategories = aiContent.categories || {}

    // Merge AI categories into our master object
    Object.keys(categories).forEach(cat => {
      if (aiCategories[cat] && Array.isArray(aiCategories[cat])) {
        // Append AI questions but keep local technical questions first
        categories[cat] = [...categories[cat], ...aiCategories[cat]]
      }
    })

    return NextResponse.json(categories)

  } catch (error: any) {
    console.error("COMPANY QUESTIONS 2.0 ERROR:", error)
    return NextResponse.json(
      { error: "Could not generate category-based database.", details: error.message },
      { status: 500 }
    )
  }
}
