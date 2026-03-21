"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useState } from "react"

type Quiz = {
  question: string
  options: string[]
  answer: string
  explanation: string
}

const topicLinks: Record<string, string> = {
  Array: "https://leetcode.com/problem-list/5iwt4mws/",
  String: "https://leetcode.com/problem-list/5iwkvpit/",
  Matrix: "https://leetcode.com/problem-list/5iwkey46/",
  "Bit Manipulation": "https://leetcode.com/problem-list/5iw8d2l1/",
  "Linked List": "https://leetcode.com/problem-list/5iw6zodi/",
  "Dynamic Programming": "https://leetcode.com/problem-list/5iw8y6z7/",
  Heap: "https://leetcode.com/problem-list/5iwgdqcm/",
  Graph: "https://leetcode.com/problem-list/5iw3e1wt/",
  Tree: "https://leetcode.com/problem-list/5iwk3292/",
}

const cnQuiz: Quiz[] = [
  {
    question: "The computer network is",
    options: [
      "Network computer with cable",
      "Network computer without cable",
      "Both of the above",
      "None of the above",
    ],
    answer: "Both of the above",
    explanation:
      "A computer network can be wired (using cables) or wireless (WiFi). Both methods connect computers to share data and resources.",
  },
  {
    question: "FTP stands for",
    options: [
      "File transfer protocol",
      "File transmission protocol",
      "Form transfer protocol",
      "Form transmission protocol",
    ],
    answer: "File transfer protocol",
    explanation:
      "FTP is a standard network protocol used to transfer files between a client and server over the internet.",
  },
  {
    question: "Which is the main function of transport layer?",
    options: [
      "Node to node delivery",
      "End to end delivery",
      "Synchronization",
      "Updating routing tables",
    ],
    answer: "End to end delivery",
    explanation:
      "The transport layer ensures reliable communication between end systems using protocols like TCP and UDP.",
  },
]

export default function InterviewNotesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Interview Important Notes
          </h1>

          <p className="text-foreground/70 max-w-2xl">
            Important theory topics frequently asked in technical interviews.
            Covers OS, DBMS, Computer Networks, OOPS and MCQs to test
            your subject knowledge.
          </p>
        </div>

        {/* CONTENT OVERVIEW */}

        <Card className="p-6 mb-10 bg-card/60 border-border/50">
          <h2 className="text-xl font-semibold mb-4">
            Contents of this Guide
          </h2>

          <ul className="space-y-2 text-sm text-foreground/70">
            <li>1️⃣ Frequently asked coding problem categories</li>
            <li>2️⃣ Important CS theory topics (OS, DBMS, CN, OOPS)</li>
            <li>3️⃣ MCQ quiz to test your fundamentals</li>
          </ul>
        </Card>

        {/* SECTION 1 */}

        <div className="mb-12">

          <h2 className="text-2xl font-bold mb-4">
            Coding Topics Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {Object.keys(topicLinks).map((topic) => (

              <Card
                key={topic}
                onClick={() => window.open(topicLinks[topic], "_blank")}
                className="p-4 text-center hover:border-primary transition cursor-pointer flex items-center justify-center gap-2"
              >
                {topic}
                <ExternalLink size={16} className="opacity-60" />
              </Card>

            ))}

          </div>

        </div>

        {/* SECTION 2 */}

        <div className="mb-12">

          <h2 className="text-2xl font-bold mb-6">
            Core Computer Science Subjects
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-3 text-lg">
                Operating System
              </h3>

              <ul className="space-y-1 text-sm text-foreground/70">
                <li>Process vs Thread</li>
                <li>Scheduling Algorithms</li>
                <li>Memory Management</li>
                <li>Deadlocks</li>
                <li>Paging and Segmentation</li>
                <li>Mutex vs Semaphore</li>
              </ul>
            </Card>

            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-3 text-lg">
                Database Management System
              </h3>

              <ul className="space-y-1 text-sm text-foreground/70">
                <li>Normalization</li>
                <li>Keys in DBMS</li>
                <li>SQL Queries</li>
                <li>Joins</li>
                <li>ACID Properties</li>
                <li>Indexing</li>
              </ul>
            </Card>

            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-3 text-lg">
                Computer Networks
              </h3>

              <ul className="space-y-1 text-sm text-foreground/70">
                <li>OSI Model</li>
                <li>TCP vs UDP</li>
                <li>DNS / DHCP / FTP</li>
                <li>HTTP vs HTTPS</li>
                <li>Network Topologies</li>
              </ul>
            </Card>

            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-3 text-lg">
                Object Oriented Programming
              </h3>

              <ul className="space-y-1 text-sm text-foreground/70">
                <li>Encapsulation</li>
                <li>Inheritance</li>
                <li>Polymorphism</li>
                <li>Abstraction</li>
                <li>Constructor / Destructor</li>
                <li>Function Overloading</li>
              </ul>
            </Card>

          </div>

        </div>

        {/* SECTION 3 QUIZ */}

        <div>

          <h2 className="text-2xl font-bold mb-6">
            Computer Networks Quiz
          </h2>

          <div className="space-y-4">

            {cnQuiz.map((quiz, index) => (

              <Card
                key={index}
                className="p-6 border-border/50 cursor-pointer hover:border-primary transition"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >

                <h3 className="font-semibold mb-3">
                  {quiz.question}
                </h3>

                <ul className="space-y-1 text-sm text-foreground/70 mb-3">
                  {quiz.options.map((opt) => (
                    <li key={opt}>• {opt}</li>
                  ))}
                </ul>

                {openIndex === index && (
                  <div className="mt-4 text-sm">

                    <p className="text-green-500 font-medium mb-2">
                      Answer: {quiz.answer}
                    </p>

                    <p className="text-foreground/70">
                      {quiz.explanation}
                    </p>

                  </div>
                )}

              </Card>

            ))}

          </div>

        </div>

      </div>
    </main>
  )
}