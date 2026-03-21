"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { companyQuestionMap } from "@/lib/company-questions"

function CompanyQuestionsContent() {

  const [selectedCompany, setSelectedCompany] = useState("tcs")
  const [selectedStage, setSelectedStage] = useState("common")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const companies = Object.keys(companyQuestionMap)

  const stages =
    Object.keys(companyQuestionMap[selectedCompany] || {})

  const questions =
    companyQuestionMap[selectedCompany]?.[selectedStage] || []

  return (
    <main className="min-h-screen bg-background">

      <div className="container mx-auto max-w-6xl px-4 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold mb-3">
            Company Interview Questions
          </h1>

          <p className="text-foreground/70">
            Practice company coding questions with quick one-line solutions.
          </p>

        </div>

        {/* Filters */}

        <div className="grid md:grid-cols-2 gap-4 mb-8">

          {/* Company */}

          <div>

            <label className="text-sm font-medium mb-2 block">
              Company
            </label>

            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value)
                setSelectedStage("")
              }}
              className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm"
            >

              {companies.map((company) => (

                <option key={company} value={company}>
                  {company.toUpperCase()}
                </option>

              ))}

            </select>

          </div>

          {/* Stage */}

          <div>

            <label className="text-sm font-medium mb-2 block">
              Stage
            </label>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm"
            >

              {stages.map((stage) => (

                <option key={stage} value={stage}>
                  {stage.toUpperCase()}
                </option>

              ))}

            </select>

          </div>

        </div>

        {/* Questions */}

        <Card className="p-6 border-border/50 bg-card/50">

          <h2 className="text-xl font-bold text-primary mb-6">
            Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-3">

            {questions.map((q: any) => (

              <div
                key={q.id}
                className="border border-border/30 rounded-lg bg-background/40 overflow-hidden"
              >

                <button
                  onClick={() =>
                    setOpenQuestion(openQuestion === q.id ? null : q.id)
                  }
                  className="w-full text-left p-3 text-sm hover:bg-primary/10 transition"
                >
                  {q.title}
                </button>

                {openQuestion === q.id && (

                  <div className="px-4 pb-3 text-sm text-foreground/70 border-t border-border/20">

                    💡 {q.description}

                  </div>

                )}

              </div>

            ))}

          </div>

        </Card>

        {/* Coming Soon */}

        <Card className="mt-10 p-6 border-primary/30 bg-primary/10">

          <h2 className="text-lg font-bold text-primary mb-3">
            More Companies Coming Soon 🚀
          </h2>

          <p className="text-foreground/80">

            Google • Amazon • Microsoft • Uber • Adobe • Oracle • Zoho • Nvidia • Atlassian

          </p>

        </Card>

      </div>

    </main>
  )
}

export default function CompanyQuestionsPage() {

  return (
    <ProtectedRoute>
      <CompanyQuestionsContent />
    </ProtectedRoute>
  )
}