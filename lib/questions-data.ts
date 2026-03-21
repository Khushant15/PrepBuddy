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

/*
Available companies currently supported:
Google, Amazon, Microsoft, Meta, Apple, Netflix,
Cisco, Deloitte, Flipkart, TCS, Accenture,
Capgemini, Cognizant, Wipro,
Uber, Adobe, PayPal, Oracle, Samsung, Salesforce,
IBM, Zoho, Nvidia, Intel, Atlassian etc.
*/

export const companyQuestions: CompanyQuestion[] = [

  {
    id: "google-1",
    title: "Design LRU Cache",
    company: "Google",
    role: "Backend Engineer",
    difficulty: "Medium",
    category: "System Design",
    description:
      "Design and implement a data structure for LRU cache with O(1) get and put operations.",
    tags: ["HashMap", "LinkedList", "Cache"],
  },

  {
    id: "amazon-1",
    title: "Longest Increasing Subsequence",
    company: "Amazon",
    role: "Software Engineer",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Given an unsorted array, find the length of the longest subsequence of increasing elements.",
    tags: ["DP", "Arrays"],
  },

  {
    id: "meta-1",
    title: "Median of Two Sorted Arrays",
    company: "Meta",
    role: "Full Stack Engineer",
    difficulty: "Hard",
    category: "Binary Search",
    description:
      "Find the median of two sorted arrays with O(log(min(m,n))) time complexity.",
    tags: ["BinarySearch", "Arrays"],
  },

  {
    id: "microsoft-1",
    title: "Reverse String in Place",
    company: "Microsoft",
    role: "Software Engineer",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Reverse a string in-place with O(1) space complexity.",
    tags: ["Strings", "TwoPointers"],
  },

  {
    id: "apple-1",
    title: "Number of Islands",
    company: "Apple",
    role: "Backend Engineer",
    difficulty: "Medium",
    category: "Graphs",
    description:
      "Given a 2D grid, count the number of islands.",
    tags: ["DFS", "BFS", "Graphs"],
  },

  {
    id: "netflix-1",
    title: "Implement a Rate Limiter",
    company: "Netflix",
    role: "Senior Engineer",
    difficulty: "Hard",
    category: "System Design",
    description:
      "Design and implement a rate limiter using token bucket algorithm.",
    tags: ["SystemDesign", "Algorithms"],
  },

  {
    id: "uber-1",
    title: "Find K Closest Points",
    company: "Uber",
    role: "Software Engineer",
    difficulty: "Medium",
    category: "Heap",
    description:
      "Given points on a 2D plane, find the k closest points to origin.",
    tags: ["Heap", "Geometry"],
  },

  {
    id: "adobe-1",
    title: "Word Break Problem",
    company: "Adobe",
    role: "Software Engineer",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Determine if a string can be segmented into words from a dictionary.",
    tags: ["DP", "Strings"],
  },

  {
    id: "paypal-1",
    title: "Two Sum Problem",
    company: "PayPal",
    role: "Backend Engineer",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Find two numbers in array that add up to a target value.",
    tags: ["HashMap", "Arrays"],
  },

  {
    id: "oracle-1",
    title: "Merge Intervals",
    company: "Oracle",
    role: "Software Developer",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Merge overlapping intervals from a list of intervals.",
    tags: ["Sorting", "Arrays"],
  },

  {
    id: "zoho-1",
    title: "String Compression",
    company: "Zoho",
    role: "Software Engineer",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Compress repeated characters in a string using counts.",
    tags: ["Strings"],
  },

  {
    id: "flipkart-1",
    title: "Subarray Sum Equals K",
    company: "Flipkart",
    role: "SDE-1",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Count number of subarrays whose sum equals a given value K.",
    tags: ["PrefixSum", "HashMap"],
  },

  {
    id: "tcs-1",
    title: "Maximum Subarray Sum",
    company: "TCS",
    role: "Ninja",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find maximum sum of contiguous subarray.",
    tags: ["Kadane", "Arrays"],
  },

  {
    id: "accenture-1",
    title: "Prime Number Check",
    company: "Accenture",
    role: "Associate Software Engineer",
    difficulty: "Easy",
    category: "Math",
    description:
      "Check whether a given number is prime.",
    tags: ["Math"],
  },

  {
    id: "capgemini-1",
    title: "Binary Search",
    company: "Capgemini",
    role: "Analyst",
    difficulty: "Easy",
    category: "Searching",
    description:
      "Implement binary search on sorted array.",
    tags: ["BinarySearch"],
  },

  {
    id: "cognizant-1",
    title: "Palindrome Check",
    company: "Cognizant",
    role: "Programmer Analyst",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Check if a string reads the same backward.",
    tags: ["Strings"],
  },

  {
    id: "wipro-1",
    title: "Find Missing Number",
    company: "Wipro",
    role: "Project Engineer",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Find missing number from sequence 1..n.",
    tags: ["Arrays"],
  },

  {
    id: "deloitte-1",
    title: "Valid Parentheses",
    company: "Deloitte",
    role: "Technology Analyst",
    difficulty: "Easy",
    category: "Stack",
    description:
      "Determine whether parentheses string is valid.",
    tags: ["Stack"],
  },

  {
    id: "cisco-1",
    title: "Cycle Detection in Graph",
    company: "Cisco",
    role: "Network Engineer",
    difficulty: "Medium",
    category: "Graphs",
    description:
      "Detect cycle in directed graph.",
    tags: ["Graph", "DFS"],
  },

  {
    id: "etc-1",
    title: "More Companies Coming Soon",
    company: "Etc.",
    role: "Various Roles",
    difficulty: "Easy",
    category: "General",
    description:
      "Questions from companies like Nvidia, Intel, Atlassian, Samsung, IBM etc will be added soon.",
    tags: ["ComingSoon"],
  },

]

export const hrQuestions: HRQuestion[] = [

  {
    id: "intro-1",
    category: "Intro",
    question: "Tell me about yourself",
    sampleAnswer:
      "I'm a passionate software engineer with strong interest in building scalable applications. I enjoy solving algorithmic problems and building full-stack projects. Recently I worked on a project that improved API performance by 40%. I'm excited to contribute my skills while learning from experienced engineers.",
    tips: [
      "Keep answer under 2 minutes",
      "Mention relevant experience",
      "Highlight achievements",
      "Show enthusiasm for role",
    ],
  },

  {
    id: "strength-1",
    category: "Strengths",
    question: "What are your biggest strengths?",
    sampleAnswer:
      "My strengths are problem solving and adaptability. I enjoy breaking down complex problems and finding optimized solutions. In my last project, I improved database query performance which reduced response time by 50%.",
    tips: [
      "Pick strengths relevant to job",
      "Use real examples",
      "Avoid generic answers",
      "Show measurable impact",
    ],
  },

  {
    id: "failure-1",
    category: "Failures",
    question: "Tell me about a failure and what you learned",
    sampleAnswer:
      "During one project I underestimated the importance of scalability. The system struggled under higher load. This experience taught me to always consider scalability early and run performance tests before deployment.",
    tips: [
      "Be honest",
      "Focus on learning",
      "Show improvement",
      "Avoid blaming others",
    ],
  },

  {
    id: "star-1",
    category: "STAR",
    question: "Describe a challenge you overcame",
    sampleAnswer:
      "Situation: Our app had slow response times. Task: Improve performance. Action: I optimized database queries and added caching. Result: Response time improved from 4 seconds to 300ms.",
    tips: [
      "Use STAR format",
      "Mention metrics",
      "Explain your contribution",
      "Show results clearly",
    ],
  },

  {
    id: "culture-1",
    category: "Culture",
    question: "How do you handle disagreements with teammates?",
    sampleAnswer:
      "I focus on understanding the other person's perspective first. Then I explain my reasoning using data and examples. Usually we evaluate both approaches and pick the best solution for the project.",
    tips: [
      "Show teamwork",
      "Stay respectful",
      "Use examples",
      "Focus on best outcome",
    ],
  },

  {
    id: "questions-1",
    category: "Questions",
    question: "What questions do you have for us?",
    sampleAnswer:
      "I'd like to know more about the technical roadmap of the team, opportunities for learning new technologies, and how cross-team collaboration works.",
    tips: [
      "Ask thoughtful questions",
      "Avoid salary questions initially",
      "Show curiosity",
      "Focus on growth and learning",
    ],
  },

]