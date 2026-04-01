"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileUp, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ResumeUploadProps {
  onParsed: (data: any) => void
}

export function ResumeUpload({ onParsed }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/interview/parse", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()
      if (result.data) {
        onParsed(result.data)
        setIsDone(true)
        toast.success("Resume parsed successfully!")
      } else {
        toast.error("Failed to parse resume")
      }
    } catch (error) {
      toast.error("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        disabled={isUploading}
      />
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={isUploading || isDone}
        className={`gap-2 rounded-full ${isDone ? "bg-green-500/10 text-green-500 border-green-500/50" : ""}`}
      >
        <label htmlFor="resume-upload" className="cursor-pointer">
          {isUploading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : isDone ? (
            <CheckCircle2 size={16} />
          ) : (
            <FileUp size={16} />
          )}
          {isUploading ? "Parsing..." : isDone ? "Resume Loaded" : "Upload Resume"}
        </label>
      </Button>
    </div>
  )
}
