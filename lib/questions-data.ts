export interface CompanyQuestion {
  id: string
  title: string
  company: string
  role: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  description: string
  tags: string[]
}

export interface HRQuestion {
  id: string
  category: "Intro" | "Strengths" | "Failures" | "STAR" | "Culture" | "Questions"
  question: string
  sampleAnswer: string
  tips: string[]
}

export const companyQuestions: CompanyQuestion[] = [
  {
    id: "google-1",
    title: "Design LRU Cache",
    company: "Google",
    role: "Backend Engineer",
    difficulty: "Medium",
    category: "System Design",
    description: "Design and implement a data structure for LRU cache with O(1) get and put operations.",
    tags: ["HashMap", "LinkedList", "Cache"],
  },
  {
    id: "amazon-1",
    title: "Longest Increasing Subsequence",
    company: "Amazon",
    role: "Software Engineer",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an unsorted array, find the length of the longest subsequence of increasing elements.",
    tags: ["DP", "Arrays"],
  },
  {
    id: "meta-1",
    title: "Median of Two Sorted Arrays",
    company: "Meta",
    role: "Full Stack Engineer",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Find the median of two sorted arrays with O(log(min(m,n))) time complexity.",
    tags: ["BinarySearch", "Arrays"],
  },
  {
    id: "microsoft-1",
    title: "Reverse String in Place",
    company: "Microsoft",
    role: "Software Engineer",
    difficulty: "Easy",
    category: "Strings",
    description: "Reverse a string in-place with O(1) space complexity.",
    tags: ["Strings", "TwoPointers"],
  },
  {
    id: "apple-1",
    title: "Number of Islands",
    company: "Apple",
    role: "Backend Engineer",
    difficulty: "Medium",
    category: "Graphs",
    description: "Given a 2D grid, count the number of islands.",
    tags: ["DFS", "BFS", "Graphs"],
  },
  {
    id: "netflix-1",
    title: "Implement a Rate Limiter",
    company: "Netflix",
    role: "Senior Engineer",
    difficulty: "Hard",
    category: "System Design",
    description: "Design and implement a rate limiter using token bucket algorithm.",
    tags: ["SystemDesign", "Algorithms"],
  },
]

export const hrQuestions: HRQuestion[] = [
  {
    id: "intro-1",
    category: "Intro",
    question: "Tell me about yourself",
    sampleAnswer:
      "I'm a passionate software engineer with 3 years of experience in full-stack development. I specialize in building scalable web applications using React and Node.js. Recently, I led a project that improved our API response time by 40%. I'm excited about this opportunity because your company's focus on innovation aligns with my career goals.",
    tips: [
      "Keep it concise - 2-3 minutes",
      "Mention relevant experience and achievements",
      "Express genuine interest in the role",
      "Use specific examples, not generic statements",
    ],
  },
  {
    id: "strength-1",
    category: "Strengths",
    question: "What are your biggest strengths?",
    sampleAnswer:
      "My biggest strengths are problem-solving and adaptability. I excel at breaking down complex problems and finding efficient solutions. In my last project, I redesigned our data pipeline which reduced processing time from 2 hours to 15 minutes. I'm also quick to learn new technologies and adapt to changing requirements.",
    tips: [
      "Choose strengths relevant to the role",
      "Back them up with specific examples",
      "Avoid generic answers like 'I'm a hard worker'",
      "Show how your strengths benefit the team",
    ],
  },
  {
    id: "failure-1",
    category: "Failures",
    question: "Tell me about a time you failed and what you learned",
    sampleAnswer:
      "In my second year, I built a feature without properly considering scalability. It crashed under production load. This was a turning point - I realized the importance of understanding system requirements upfront. Now, I always start with capacity planning and load testing. This experience made me a better engineer.",
    tips: [
      "Be honest but show growth",
      "Focus on what you learned",
      "Don't blame others",
      "Show how you applied the lesson",
    ],
  },
  {
    id: "star-1",
    category: "STAR",
    question: "Describe a situation where you overcame a difficult challenge",
    sampleAnswer:
      "Situation: Our main API was timing out, affecting all users. Task: I needed to fix it urgently. Action: I profiled the code, found N+1 queries, and added database indexing. I also implemented caching. Result: Response time dropped from 5s to 200ms, improving user experience significantly.",
    tips: [
      "Structure using STAR: Situation, Task, Action, Result",
      "Be specific with metrics and outcomes",
      "Highlight your role clearly",
      "Show technical and soft skills",
    ],
  },
  {
    id: "culture-1",
    category: "Culture",
    question: "How do you handle disagreements with team members?",
    sampleAnswer:
      "I believe in respectful collaboration. When I disagree, I first listen to understand their perspective. Then I present my viewpoint with data and examples. Recently, our team disagreed on architecture approach. We discussed pros/cons, ran prototypes, and chose the solution that balanced performance and maintainability.",
    tips: [
      "Show maturity and respect",
      "Give a real example",
      "Demonstrate listening skills",
      "Focus on finding the best solution",
    ],
  },
  {
    id: "questions-1",
    category: "Questions",
    question: "What questions do you have for us?",
    sampleAnswer:
      "Great! I'm curious about: 1) What does the technical roadmap look like for this team? 2) How does the company foster continuous learning? 3) What's the typical day-to-day collaboration like with other teams?",
    tips: [
      "Ask thoughtful questions about growth and impact",
      "Avoid asking about salary/benefits initially",
      "Show genuine interest in the role and company",
      "Ask about team dynamics and learning opportunities",
    ],
  },
]
