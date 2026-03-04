export interface RoadmapStage {
  id: string
  title: string
  description: string
  duration: string
  topics: string[]
  completed: boolean
  resources: string[]
}

export interface Roadmap {
  id: string
  role: string
  company: string
  duration: string
  stages: RoadmapStage[]
}

export const roadmaps: Roadmap[] = [
  {
    id: "fullstack-meta",
    role: "Full Stack Engineer",
    company: "Meta",
    duration: "12 weeks",
    stages: [
      {
        id: "stage-1",
        title: "Foundations",
        description: "Master core DSA and fundamentals",
        duration: "3 weeks",
        topics: ["Arrays", "Strings", "Linked Lists", "Hash Tables"],
        completed: true,
        resources: ["LeetCode Easy", "Data Structures Course"],
      },
      {
        id: "stage-2",
        title: "Advanced DSA",
        description: "Trees, graphs, and advanced algorithms",
        duration: "4 weeks",
        topics: ["Trees", "Graphs", "Binary Search", "Dynamic Programming"],
        completed: true,
        resources: ["LeetCode Medium", "Algorithm Visualizer"],
      },
      {
        id: "stage-3",
        title: "System Design",
        description: "Design scalable systems",
        duration: "3 weeks",
        topics: ["Scalability", "Databases", "Caching", "Load Balancing"],
        completed: false,
        resources: ["System Design Primer", "Design Patterns"],
      },
      {
        id: "stage-4",
        title: "Mock Interviews",
        description: "Practice with real scenarios",
        duration: "2 weeks",
        topics: ["Technical Interview", "Behavioral", "Code Review"],
        completed: false,
        resources: ["Mock Interview Platform", "Feedback Sessions"],
      },
    ],
  },
  {
    id: "backend-google",
    role: "Backend Engineer",
    company: "Google",
    duration: "10 weeks",
    stages: [
      {
        id: "stage-1",
        title: "DSA Bootcamp",
        description: "Complete data structures and algorithms",
        duration: "4 weeks",
        topics: ["All DSA Topics", "Recursion", "Problem Solving"],
        completed: true,
        resources: ["Comprehensive DSA Guide"],
      },
      {
        id: "stage-2",
        title: "System Design Mastery",
        description: "Deep dive into distributed systems",
        duration: "4 weeks",
        topics: ["Distributed Systems", "Microservices", "Consistency Models"],
        completed: false,
        resources: ["System Design Interview Guide"],
      },
      {
        id: "stage-3",
        title: "Final Prep",
        description: "Company-specific questions and mocks",
        duration: "2 weeks",
        topics: ["Google Specific", "Mock Rounds", "Behavioral Prep"],
        completed: false,
        resources: ["Google Interview Questions"],
      },
    ],
  },
]

export const resources = [
  {
    id: "resource-1",
    title: "LeetCode Premium",
    category: "Practice",
    url: "https://leetcode.com",
    description: "1000+ coding problems with solutions",
    recommended: true,
  },
  {
    id: "resource-2",
    title: "System Design Primer",
    category: "System Design",
    url: "#",
    description: "Comprehensive guide to system design",
    recommended: true,
  },
  {
    id: "resource-3",
    title: "Educative - Grokking Algorithms",
    category: "Learning",
    url: "#",
    description: "Visual algorithm learning platform",
    recommended: false,
  },
  {
    id: "resource-4",
    title: "Big O Cheatsheet",
    category: "Reference",
    url: "#",
    description: "Quick reference for time and space complexity",
    recommended: true,
  },
  {
    id: "resource-5",
    title: "Blind 75",
    category: "Practice",
    url: "#",
    description: "Must-do curated list of interview problems",
    recommended: true,
  },
  {
    id: "resource-6",
    title: "System Design Interview",
    category: "System Design",
    url: "#",
    description: "Complete system design course and examples",
    recommended: true,
  },
]
