import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || "Coding Interview Preparation"

    const youtubeKey = process.env.YOUTUBE_API_KEY
    const devtoKey = process.env.DEVTO_API_KEY

    // 1. Fetch from YouTube
    let ytResults = []
    if (youtubeKey) {
      try {
        const ytRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            q: query,
            key: youtubeKey,
            maxResults: 6,
            type: "video"
          }
        })
        ytResults = ytRes.data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          type: "video",
          source: "YouTube"
        }))
      } catch (e) {
        console.error("YouTube API Error")
      }
    }

    // 2. Fetch from Dev.to
    let devtoResults = []
    try {
      const devtoRes = await axios.get("https://dev.to/api/articles", {
        params: {
          tag: "interview",
          top: 30,
          per_page: 6
        }
      })
      devtoResults = devtoRes.data.map((article: any) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        thumbnail: article.social_image || article.cover_image,
        url: article.url,
        type: "article",
        source: "Dev.to"
      }))
    } catch (e) {
      console.error("Dev.to API Error")
    }

    return NextResponse.json({
      youtube: ytResults,
      articles: devtoResults
    })

  } catch (error: any) {
    console.error("RESOURCES API ERROR:", error.message)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}
