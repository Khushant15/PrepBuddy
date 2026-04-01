import { NextResponse } from "next/server"
import { AssemblyAI } from "assemblyai"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as Blob
    
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const apiKey = process.env.ASSEMBLYAI_API_KEY
    if (!apiKey) throw new Error("Missing ASSEMBLYAI_API_KEY")

    const client = new AssemblyAI({ apiKey })

    // Convert Blob to Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer())
    console.log("Received audio buffer size:", buffer.length, "bytes")

    if (buffer.length < 1000) {
       console.error("Buffer too small! The browser sent silent/empty audio.")
       throw new Error("Transcribed audio file is effectively empty")
    }

    // Transcription
    const transcript = await client.transcripts.transcribe({
      audio: buffer,
      speech_models: ["universal-3-pro"]
    })

    if (transcript.status === "error") {
      console.error("AssemblyAI Transcription Error:", transcript.error)
      throw new Error(transcript.error)
    }

    console.log("Transcription successful. Text:", transcript.text)

    return NextResponse.json({ text: transcript.text })

  } catch (error: any) {
    console.error("ASSEMBLYAI ERROR:", error)
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    )
  }
}
