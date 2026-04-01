import { NextResponse } from "next/server"
import { executeCode } from "@/lib/judge0-service"
import { checkRateLimit } from "@/lib/rate-limit"
import { getAuthUser } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    // 5 code executions per minute
    const rateLimit = checkRateLimit(user.uid, 5, 60000)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many compiler requests. Please try again in ${rateLimit.retryAfter}s.` }, 
        { status: 429 }
      )
    }

    const { sourceCode, languageId } = await req.json()

    if (!sourceCode) {
      return NextResponse.json({ error: "Source code is required" }, { status: 400 })
    }

    const result = await executeCode(sourceCode, languageId || 63)

    return NextResponse.json({
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
        message: result.message,
        status: result.status,
    })

  } catch (error: any) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    console.error(`CODING API ERROR [${status}]:`, message)
    
    return NextResponse.json(
      { error: "Failed to execute code", details: message }, 
      { status: 500 }
    )
  }
}
