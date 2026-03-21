"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

function HRPrepContent() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const sections = [
    {
      title: "General Questions",
      questions: [
        "Tell me about yourself?",
        "Why are you applying for this job?",
        "What do you know about our company?",
        "Why should we hire you?",
        "Describe yourself in three words.",
        "Describe yourself in one word.",
        "What are your strengths?",
        "What are your weaknesses?",
        "What are your hobbies?",
        "What are your achievements in life?",
        "What is your objective in life?",
        "What makes you unique?",
        "How do you handle failure?",
        "How do you handle success?"
      ]
    },
    {
      title: "Behavioral Questions",
      questions: [
        "Tell me about a time you faced a challenge at work.",
        "Give an example of when you worked in a team.",
        "Describe a conflict with a coworker and how you resolved it.",
        "Have you ever failed at something? What did you learn?",
        "Tell me about a time you had to meet a tight deadline.",
        "Have you ever led a team?",
        "Give an example of when you went above and beyond.",
        "Tell me about adapting to a big change.",
        "Describe learning a new skill quickly."
      ]
    },
    {
      title: "Work Ethic & Motivation",
      questions: [
        "What motivates you to work?",
        "How do you handle stress or pressure?",
        "How do you prioritize tasks?",
        "What is your work style?",
        "How do you handle criticism?",
        "Do you prefer working independently or in a team?",
        "What if you disagree with a manager’s decision?",
        "How do you stay organized?",
        "Would you work overtime or odd hours?",
        "What does success mean to you?",
        "Difference between confidence and overconfidence?",
        "Difference between smart work and hard work?"
      ]
    },
    {
      title: "Salary & Availability",
      questions: [
        "What are your salary expectations?",
        "When can you start working?",
        "Do you have other job offers?",
        "Are you open to contract or freelance work?",
        "Would you accept a lower salary for the right opportunity?",
        "How long would you expect to work for us?"
      ]
    },
    {
      title: "Company Specific Questions",
      questions: [
        "How will you contribute to our company’s success?",
        "What do you expect from us as an employer?",
        "What makes a great workplace culture?",
        "How do you handle a difficult manager?",
        "How do you stay updated with industry trends?",
        "What do you like about our company’s mission?"
      ]
    },
    {
      title: "Resume Related Questions",
      questions: [
        "Can you walk me through your resume?",
        "Why are you leaving your current job?",
        "Explain any employment gaps.",
        "What motivated your career path?",
        "Which skills from past jobs help you here?",
        "How did your previous job prepare you for this role?",
        "Tell me about a project you are proud of.",
        "Why did you choose your degree?"
      ]
    }
  ]

  const answerTips: { [key: string]: string } = {
    "Tell me about yourself?":
      "Give a 60–90 second summary: background → skills → achievements → why you're interested in the role.",

    "Why are you applying for this job?":
      "Connect your skills and interests with the role and the company's goals.",

    "What do you know about our company?":
      "Mention company products, achievements, mission, and culture.",

    "Why should we hire you?":
      "Highlight your key strengths and explain how you can add value.",

    "Describe yourself in three words.":
      "Choose professional traits and justify them briefly.",

    "Describe yourself in one word.":
      "Pick a strong professional quality and support it with an example.",

    "What are your strengths?":
      "Mention 2–3 strengths with real examples.",

    "What are your weaknesses?":
      "Mention a real weakness and show how you are improving.",

    "What motivates you to work?":
      "Talk about learning, impact, solving problems, or growth.",

    "How do you handle stress or pressure?":
      "Explain your strategy like prioritization, planning, and staying calm.",

    "How do you prioritize tasks?":
      "Mention prioritization techniques like urgent vs important tasks.",

    "What are your salary expectations?":
      "Provide a reasonable range and mention flexibility.",

    "When can you start working?":
      "State your availability honestly.",

    "Can you walk me through your resume?":
      "Explain your education, experience, and relevant achievements.",

    "Why are you leaving your current job?":
      "Focus on growth and opportunities.",

    "Explain any employment gaps.":
      "Be honest and explain productive activities during the gap.",

    "Tell me about a project you are proud of.":
      "Explain the project, your role, and its impact."
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">HR Interview Preparation</h1>
          <p className="text-foreground/70 text-lg">
            Prepare for HR interviews with categorized questions and quick tips on how to answer them effectively.
          </p>
        </div>

        <Card className="p-6 mb-10 border-primary/30 bg-primary/10">
          <h2 className="text-xl font-bold mb-4 text-primary">
            How to Prepare for an HR Interview
          </h2>

          <ul className="space-y-2 text-foreground/80">
            <li>• Research the company and its culture.</li>
            <li>• Understand the job description.</li>
            <li>• Practice common HR questions.</li>
            <li>• Be confident and authentic.</li>
            <li>• Dress professionally.</li>
            <li>• Ask thoughtful questions.</li>
          </ul>
        </Card>

        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.title} className="p-6 border-border/50 bg-card/50">
              <h2 className="text-xl font-bold text-primary mb-4">
                {section.title}
              </h2>

              <div className="grid md:grid-cols-2 gap-3">
                {section.questions.map((q, index) => (
                  <div
                    key={index}
                    className="border border-border/30 rounded-lg bg-background/40 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenQuestion(openQuestion === q ? null : q)
                      }
                      className="w-full text-left p-3 text-sm hover:bg-primary/10 transition"
                    >
                      {q}
                    </button>

                    {openQuestion === q && answerTips[q] && (
                      <div className="px-4 pb-3 text-sm text-foreground/70 border-t border-border/20">
                        💡 {answerTips[q]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-10 p-6 border-primary/30 bg-primary/10">
          <h2 className="text-lg font-bold text-primary mb-3">
            Tips for Success
          </h2>

          <ul className="space-y-2 text-foreground/80">
            <li>• Research the company before the interview.</li>
            <li>• Practice your answers clearly.</li>
            <li>• Maintain confidence and positive body language.</li>
            <li>• Ask meaningful questions to the interviewer.</li>
            <li>• Send a thank-you email after the interview.</li>
          </ul>
        </Card>

        <Card className="mt-10 p-6 border-accent/30 bg-accent/10">
          <h2 className="text-xl font-bold mb-3 text-accent">
            Company Wise HR Contacts
          </h2>

          <p className="text-foreground/70 mb-4">
            Access company HR contact details to connect with recruiters.
          </p>

          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            onClick={() =>
              window.open(
                "https://drive.google.com/drive/folders/1hJlxWGMr1UfV9UH84d_HjFP7InTMpPII",
                "_blank"
              )
            }
          >
            Open HR Contact List
            <ExternalLink size={16} />
          </Button>
        </Card>

      </div>
    </main>
  )
}

export default function HRPrepPage() {
  return (
    <ProtectedRoute>
      <HRPrepContent />
    </ProtectedRoute>
  )
}