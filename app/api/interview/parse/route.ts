import { AffindaAPI } from "@affinda/affinda"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as Blob
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const apiKey = process.env.AFFINDA_API_KEY
    const workspaceId = process.env.AFFINDA_WORKSPACE_ID
    if (!apiKey) throw new Error("Missing AFFINDA_API_KEY")
    if (!workspaceId) throw new Error("Missing AFFINDA_WORKSPACE_ID")

    const { AffindaCredential } = await import("@affinda/affinda")
    const client = new AffindaAPI(new AffindaCredential(apiKey))

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload and Parse
    const result = await client.createDocument({
      file: buffer,
      fileName: "resume.pdf",
      workspace: workspaceId,
    }) as any

    return NextResponse.json({ 
      data: result.data,
      profession: result.data?.profession || "Unknown"
    })

  } catch (error: any) {
    console.error("AFFINDA ERROR:", error)
    return NextResponse.json(
      { error: "Resume parsing failed" },
      { status: 500 }
    )
  }
}
