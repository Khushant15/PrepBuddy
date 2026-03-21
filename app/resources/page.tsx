"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resources } from "@/lib/roadmap-data"
import { Heart, ExternalLink, Star, Filter } from "lucide-react"

type ResourceCategory =
  | "All"
  | "Practice"
  | "System Design"
  | "Learning"
  | "Reference"

const leetcodeSheet =
  "https://docs.google.com/document/d/1s_uWkiq50zWzGtlfpAMjnoqqwWRh_wHl3Vlkl1iyMQ4/edit"

/* GOOGLE DRIVE MATERIALS */

const placementMaterials = [
  {
    title: "Data Structures & Algorithms",
    desc: "Complete DSA notes, coding problems and interview preparation.",
    link: "https://drive.google.com/drive/folders/1Ay5CmkoRJ5eEGcFskULc3CHNQn5iCVs3",
  },
  {
    title: "Computer Science Fundamentals",
    desc: "Operating Systems, Computer Networks and Software Engineering concepts.",
    link: "https://drive.google.com/drive/u/0/folders/18FBvExqEtt9mtNKKP65f_ETdtS7nCG1G",
  },
  {
    title: "Aptitude Preparation",
    desc: "Quantitative aptitude, logical reasoning and verbal ability materials.",
    link: "https://drive.google.com/drive/folders/1XmI6Iq_0MXJ6vq6Nkk-DcBK_y_LWNLCM",
  },
  {
    title: "Off-Campus Placement Materials",
    desc: "Preparation guides and strategies for off-campus recruitment drives.",
    link: "https://drive.google.com/drive/u/0/folders/1iKiq-ZbI3dTN0igO8xRnyaWJF_RCf2Ym",
  },
  {
    title: "Company-Specific Questions",
    desc: "Interview questions from TCS, Wipro, Accenture, Infosys and other recruiters.",
    link: "https://drive.google.com/drive/folders/1V5-NWPj1JhfBBf6wpU4rV7Ebar2ShSi5",
  },
  {
    title: "Advanced Data Structures & Algorithms",
    desc: "Advanced algorithmic problems and optimization techniques.",
    link: "https://drive.google.com/drive/folders/1Da_v5uHIvBscWcRRgMsYGq-hJ00dQL9Y",
  },
  {
    title: "Database Management System (DBMS)",
    desc: "SQL queries, database design and normalization concepts.",
    link: "https://drive.google.com/drive/folders/1f5dmqV84E-BN1PiVWqUhNXzcVWkCbGPa",
  },
  {
    title: "Cloud Computing",
    desc: "Cloud fundamentals and backend developer interview topics.",
    link: "https://drive.google.com/drive/folders/1_iB9UnsVlOWvdjKVmtC7b8b26L2ORdVR",
  },
]

function ResourcesContent() {
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] =
    useState<ResourceCategory>("All")

  const [favorited, setFavorited] = useState<Set<string>>(
    new Set(resources.filter((r) => r.recommended).map((r) => r.id))
  )

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const categories: ResourceCategory[] = [
    "All",
    "Practice",
    "System Design",
    "Learning",
    "Reference",
  ]

  const updatedResources = resources.map((r) => {
    if (r.title.toLowerCase().includes("big")) {
      return {
        ...r,
        title: "DSA Guide",
        description:
          "Complete Data Structures and Algorithms guide",
        url: "https://www.lets-code.co.in/articles/dsa/",
      }
    }

    if (r.category === "System Design") {
      return {
        ...r,
        url: "https://www.lets-code.co.in/articles/systemdesign/",
      }
    }

    return r
  })

  let filteredResources =
    selectedCategory === "All"
      ? updatedResources
      : updatedResources.filter(
          (r) => r.category === selectedCategory
        )

  if (showFavoritesOnly) {
    filteredResources = filteredResources.filter((r) =>
      favorited.has(r.id)
    )
  }

  const toggleFavorite = (id: string) => {
    const newFavorited = new Set(favorited)

    if (newFavorited.has(id)) {
      newFavorited.delete(id)
    } else {
      newFavorited.add(id)
    }

    setFavorited(newFavorited)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Interview Resources
          </h1>

          <p className="text-foreground/60">
            Curated tools, guides, and platforms to accelerate your prep
          </p>
        </div>

        {/* TOP CARDS */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <Card className="p-6 border-border/50 bg-card/50">
            <h2 className="text-xl font-bold mb-2">
              LeetCode Interview Cheatsheet
            </h2>

            <p className="text-sm text-foreground/70 mb-4">
              Curated coding roadmap helping you crack coding interviews.
            </p>

            <Button
              onClick={() => window.open(leetcodeSheet, "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Open Sheet
            </Button>
          </Card>

          <Card className="p-6 border-border/50 bg-card/50">
            <h2 className="text-xl font-bold mb-2">
              Interview Important Considerations
            </h2>

            <p className="text-sm text-foreground/70 mb-4">
              Important theory topics including OS, DBMS, OOPS, CN along with MCQs and interview concepts.
            </p>

            <Button
              onClick={() =>
                router.push("/resources/interview-notes")
              }
            >
              View Notes
            </Button>
          </Card>

        </div>

        {/* FILTER SECTION */}

        <div className="mb-8">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span className="font-semibold text-sm">
                Filter Resources
              </span>
            </div>

            <button
              onClick={() =>
                setShowFavoritesOnly(!showFavoritesOnly)
              }
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border"
            >
              <Heart size={16} />
              Favorites ({favorited.size})
            </button>

          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "border border-border/50 hover:bg-primary/10"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

        {/* RESOURCE GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">

          {filteredResources.map((resource) => (

            <Card
              key={resource.id}
              className="p-6 border-border/50 bg-card/50 hover:border-primary/50 transition-all group flex flex-col"
            >

              <div className="flex items-start justify-between mb-4">

                <div>

                  <div className="flex items-center gap-2 mb-2">

                    <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-md">
                      {resource.category}
                    </span>

                    {resource.recommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent/20 text-accent rounded-md">
                        <Star size={12} className="fill-current" />
                        Recommended
                      </span>
                    )}

                  </div>

                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>

                </div>

                <button
                  onClick={() =>
                    toggleFavorite(resource.id)
                  }
                  className="p-2"
                >
                  <Heart
                    size={20}
                    className={
                      favorited.has(resource.id)
                        ? "fill-red-500 text-red-500"
                        : "text-foreground/40"
                    }
                  />
                </button>

              </div>

              <p className="text-foreground/70 text-sm flex-1 mb-4">
                {resource.description}
              </p>

              <Button
                onClick={() =>
                  window.open(resource.url, "_blank")
                }
                className="w-full flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} />
                Visit Resource
              </Button>

            </Card>

          ))}

        </div>

        {/* PLACEMENT MATERIALS */}

        <div className="mt-20">

          <h2 className="text-3xl font-bold mb-2">
            Complete Placement Preparation Materials
          </h2>

          <p className="text-foreground/60 mb-8">
            Study material for placements including DSA, CS fundamentals, aptitude, company questions and cloud.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {placementMaterials.map((item, index) => (

              <Card
                key={index}
                className="p-6 border-border/50 bg-card/50 hover:border-primary/50 transition-all flex flex-col"
              >

                <h3 className="text-lg font-bold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-foreground/70 mb-4 flex-1">
                  {item.desc}
                </p>

                <Button
                  onClick={() =>
                    window.open(item.link, "_blank")
                  }
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  Open Materials
                </Button>

              </Card>

            ))}

          </div>

        </div>

      </div>
    </main>
  )
}

export default function ResourcesPage() {
  return (
    <ProtectedRoute>
      <ResourcesContent />
    </ProtectedRoute>
  )
}