"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm"
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        await handleTranscription(audioBlob)
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      toast.error("Microphone access denied")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleTranscription = async (blob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("audio", blob, "recording.webm")

      const res = await fetch("/api/interview/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.text) {
        onTranscript(data.text)
      } else {
        toast.error("Could not understand audio")
      }
    } catch (error) {
      toast.error("Transcription failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={startRecording}
          disabled={isProcessing}
          className="rounded-full hover:bg-red-500/10 hover:text-red-500 border-dashed"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Mic size={18} />}
        </Button>
      ) : (
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={stopRecording}
          className="rounded-full animate-pulse"
        >
          <Square size={18} />
        </Button>
      )}
    </div>
  )
}
