export const ciscoQuestions = [

{
id: "cisco-1",
company: "Cisco",
title: "Maximum Drop Points in Terrain",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find the maximum number of points lying on a single horizontal or vertical line.",
answer: "Count frequencies of x and y coordinates using HashMap",
tags: ["Array","HashMap"]
},

{
id: "cisco-2",
company: "Cisco",
title: "Lexicographical String at Index M",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find the Mth lexicographically smallest string of length N using lowercase letters.",
answer: "Treat as base-26 number conversion",
tags: ["Math","String"]
},

{
id: "cisco-3",
company: "Cisco",
title: "Reverse Words in String",
difficulty: "Easy",
role: "Online Assessment",
description:
"Reverse the order of words in a sentence.",
answer: "Split string and reverse word order",
tags: ["String"]
},

{
id: "cisco-4",
company: "Cisco",
title: "Find Missing Number",
difficulty: "Easy",
role: "Online Assessment",
description:
"Find the missing number in range [1,n].",
answer: "Use sum formula or XOR",
tags: ["Array"]
},

{
id: "cisco-5",
company: "Cisco",
title: "Longest Palindromic Substring",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find the longest palindrome substring.",
answer: "Expand around center",
tags: ["String"]
},

{
id: "cisco-6",
company: "Cisco",
title: "Two Cheapest Round Trips",
difficulty: "Hard",
role: "Online Assessment",
description:
"Find two cheapest round trips between cities.",
answer: "Use graph shortest path (Dijkstra)",
tags: ["Graph"]
},

{
id: "cisco-7",
company: "Cisco",
title: "Snake and Ladder Minimum Moves",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find minimum moves to reach end of board with snakes and ladders.",
answer: "BFS traversal",
tags: ["Graph","BFS"]
},

{
id: "cisco-8",
company: "Cisco",
title: "Shortest Path in Grid",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find shortest path in grid with obstacles.",
answer: "Dynamic Programming or BFS",
tags: ["Grid","DP"]
},

{
id: "cisco-9",
company: "Cisco",
title: "Minimum Cost Path",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find minimum cost path from top-left to bottom-right in grid.",
answer: "Dynamic Programming grid traversal",
tags: ["Dynamic Programming"]
},

{
id: "cisco-10",
company: "Cisco",
title: "Cycle Detection in Directed Graph",
difficulty: "Medium",
role: "Online Assessment",
description:
"Detect cycle in directed graph.",
answer: "DFS with recursion stack",
tags: ["Graph"]
},

{
id: "cisco-11",
company: "Cisco",
title: "Binary Tree Level Order Traversal",
difficulty: "Easy",
role: "Online Assessment",
description:
"Return level order traversal of binary tree.",
answer: "BFS traversal",
tags: ["Tree","BFS"]
},

{
id: "cisco-12",
company: "Cisco",
title: "Binary Tree Path Sum",
difficulty: "Easy",
role: "Online Assessment",
description:
"Check if root-to-leaf path equals target sum.",
answer: "DFS traversal",
tags: ["Tree"]
},

{
id: "cisco-13",
company: "Cisco",
title: "Lowest Common Ancestor",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find LCA of two nodes in binary tree.",
answer: "Recursive DFS",
tags: ["Tree"]
},

{
id: "cisco-14",
company: "Cisco",
title: "Maximum Depth of Binary Tree",
difficulty: "Easy",
role: "Online Assessment",
description:
"Find maximum depth of binary tree.",
answer: "DFS recursion",
tags: ["Tree"]
},

{
id: "cisco-15",
company: "Cisco",
title: "Balanced Binary Tree Check",
difficulty: "Easy",
role: "Online Assessment",
description:
"Check if tree is height balanced.",
answer: "Postorder DFS height check",
tags: ["Tree"]
},

{
id: "cisco-16",
company: "Cisco",
title: "Longest Common Subsequence",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find length of longest common subsequence.",
answer: "Dynamic Programming",
tags: ["DP","String"]
},

{
id: "cisco-17",
company: "Cisco",
title: "Knapsack Problem",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find maximum value with given capacity.",
answer: "Dynamic Programming 0/1 Knapsack",
tags: ["DP"]
},

{
id: "cisco-18",
company: "Cisco",
title: "Minimum Path Sum in Triangle",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find minimum path sum from top to bottom of triangle.",
answer: "Bottom-up DP",
tags: ["Dynamic Programming"]
},

{
id: "cisco-19",
company: "Cisco",
title: "Edit Distance",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find minimum operations to convert one string to another.",
answer: "Dynamic Programming",
tags: ["DP","String"]
},

{
id: "cisco-20",
company: "Cisco",
title: "Maximum Subarray Sum",
difficulty: "Easy",
role: "Online Assessment",
description:
"Find maximum sum of contiguous subarray.",
answer: "Kadane's Algorithm",
tags: ["Array"]
},

{
id: "cisco-21",
company: "Cisco",
title: "Rotate Matrix",
difficulty: "Medium",
role: "Online Assessment",
description:
"Rotate NxN matrix by 90 degrees clockwise.",
answer: "Transpose then reverse rows",
tags: ["Matrix"]
},

{
id: "cisco-22",
company: "Cisco",
title: "Spiral Matrix",
difficulty: "Medium",
role: "Online Assessment",
description:
"Print matrix elements in spiral order.",
answer: "Boundary traversal",
tags: ["Matrix"]
},

{
id: "cisco-23",
company: "Cisco",
title: "N Queens Problem",
difficulty: "Hard",
role: "Online Assessment",
description:
"Place N queens such that none attack each other.",
answer: "Backtracking",
tags: ["Backtracking"]
},

{
id: "cisco-24",
company: "Cisco",
title: "Sudoku Solver",
difficulty: "Hard",
role: "Online Assessment",
description:
"Solve a 9x9 Sudoku puzzle.",
answer: "Backtracking with constraints",
tags: ["Backtracking"]
},

{
id: "cisco-25",
company: "Cisco",
title: "Valid Parentheses",
difficulty: "Easy",
role: "Online Assessment",
description:
"Check if parentheses are properly matched.",
answer: "Stack matching",
tags: ["Stack"]
},

{
id: "cisco-26",
company: "Cisco",
title: "Merge Intervals",
difficulty: "Medium",
role: "Online Assessment",
description:
"Merge overlapping intervals.",
answer: "Sort intervals then merge",
tags: ["Array"]
},

{
id: "cisco-27",
company: "Cisco",
title: "LRU Cache",
difficulty: "Hard",
role: "Online Assessment",
description:
"Implement LRU cache with get and put operations.",
answer: "HashMap + Doubly Linked List",
tags: ["Design"]
},

{
id: "cisco-28",
company: "Cisco",
title: "Word Ladder",
difficulty: "Hard",
role: "Online Assessment",
description:
"Find shortest transformation sequence between words.",
answer: "BFS with dictionary set",
tags: ["Graph"]
},

{
id: "cisco-29",
company: "Cisco",
title: "Next Permutation",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find next lexicographically greater permutation.",
answer: "Find pivot, swap, reverse suffix",
tags: ["Array"]
},

{
id: "cisco-30",
company: "Cisco",
title: "Trapping Rain Water",
difficulty: "Hard",
role: "Online Assessment",
description:
"Calculate trapped rainwater between bars.",
answer: "Two pointer approach",
tags: ["Array"]
},

{
id: "cisco-31",
company: "Cisco",
title: "Cake Cutting Puzzle",
difficulty: "Easy",
role: "Puzzle",
description:
"Cut a circular cake into 8 equal pieces using 3 cuts.",
answer: "Two vertical cuts and one horizontal cut",
tags: ["Puzzle"]
},

{
id: "cisco-32",
company: "Cisco",
title: "Transmission Latency",
difficulty: "Medium",
role: "Networking Problem",
description:
"Find minimum time to send message across network.",
answer: "Dijkstra shortest path",
tags: ["Graph"]
},

{
id: "cisco-33",
company: "Cisco",
title: "IP Address Validation",
difficulty: "Easy",
role: "Networking Problem",
description:
"Check if string is valid IPv4 address.",
answer: "Split by '.' and validate 0-255",
tags: ["String"]
},

{
id: "cisco-34",
company: "Cisco",
title: "Packet Routing",
difficulty: "Medium",
role: "Networking Problem",
description:
"Find shortest path for packet routing.",
answer: "Dijkstra algorithm",
tags: ["Graph"]
},

{
id: "cisco-35",
company: "Cisco",
title: "Number of Islands",
difficulty: "Medium",
role: "Online Assessment",
description:
"Count number of islands in grid.",
answer: "DFS/BFS traversal",
tags: ["Grid","Graph"]
}

]