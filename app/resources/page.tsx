"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resources } from "@/lib/roadmap-data"
import { Heart, ExternalLink, Star, Filter } from "lucide-react"

type ResourceCategory = "All" | "Practice" | "System Design" | "Learning" | "Reference"

function ResourcesContent() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>("All")
  const [favorited, setFavorited] = useState<Set<string>>(
    new Set(resources.filter((r) => r.recommended).map((r) => r.id)),
  )
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const categories: ResourceCategory[] = ["All", "Practice", "System Design", "Learning", "Reference"]

  let filteredResources =
    selectedCategory === "All" ? resources : resources.filter((r) => r.category === selectedCategory)

  if (showFavoritesOnly) {
    filteredResources = filteredResources.filter((r) => favorited.has(r.id))
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
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Interview Resources</h1>
          <p className="text-foreground/60">Curated tools, guides, and platforms to accelerate your prep</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span className="font-semibold text-sm">Filter by Category</span>
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                showFavoritesOnly
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <Heart size={16} className={showFavoritesOnly ? "fill-current" : ""} />
              My Favorites ({favorited.size})
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-accent text-foreground"
                    : "border border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Result Count */}
        <p className="text-sm text-foreground/60 mb-6">
          Showing {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
        </p>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="p-6 border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/70 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-md">
                      {resource.category}
                    </span>
                    {resource.recommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded-md">
                        <Star size={12} className="fill-current" />
                        Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{resource.title}</h3>
                </div>
                <button
                  onClick={() => toggleFavorite(resource.id)}
                  className="shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors ml-2"
                  title="Add to favorites"
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      favorited.has(resource.id)
                        ? "fill-destructive text-destructive"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  />
                </button>
              </div>

              <p className="text-foreground/70 text-sm leading-relaxed flex-1 mb-4">{resource.description}</p>

              <Button className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent border group/btn flex items-center justify-center gap-2">
                <ExternalLink size={16} className="group-hover/btn:text-primary transition-colors" />
                <span className="group-hover/btn:text-primary transition-colors">Visit Resource</span>
              </Button>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card className="p-8 text-center border-border/50 bg-card/50">
            <p className="text-foreground/70 mb-4">No resources found matching your filters.</p>
            <Button
              variant="outline"
              className="border-border/50 hover:bg-primary/10 bg-transparent"
              onClick={() => {
                setSelectedCategory("All")
                setShowFavoritesOnly(false)
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
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
