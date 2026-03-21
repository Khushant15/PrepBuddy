export const deloitteQuestions = [

{
id: "deloitte-1",
company: "Deloitte",
title: "Class Monitor",
difficulty: "Medium",
role: "Online Assessment",
description:
"Given ranks observed by the HOD, determine how many times the monitor name is replaced when a lower rank appears.",
answer: "Count decreases using running minimum",
tags: ["Array","Greedy"]
},

{
id: "deloitte-2",
company: "Deloitte",
title: "Corona for Computer",
difficulty: "Easy",
role: "Online Assessment",
description:
"A virus removes the n least significant bits from numbers in an array.",
answer: "Right shift each number by n bits",
tags: ["Bit Manipulation"]
},

{
id: "deloitte-3",
company: "Deloitte",
title: "Help of Prepsters",
difficulty: "Medium",
role: "Online Assessment",
description:
"Count numbers less than n having exactly k set bits.",
answer: "Use combinatorics with bit counting",
tags: ["Bit Manipulation","Math"]
},

{
id: "deloitte-4",
company: "Deloitte",
title: "Momentum LinkedList",
difficulty: "Easy",
role: "Online Assessment",
description:
"Compute total momentum of particles where momentum = mass × velocity.",
answer: "Sum of mass × velocity",
tags: ["Linked List","Math"]
},

{
id: "deloitte-5",
company: "Deloitte",
title: "Lazy String",
difficulty: "Hard",
role: "Online Assessment",
description:
"Find lexicographically smallest longest common subsequence of two strings.",
answer: "Dynamic Programming LCS with lexicographic comparison",
tags: ["Dynamic Programming","String"]
},

{
id: "deloitte-6",
company: "Deloitte",
title: "Unique Permutations",
difficulty: "Medium",
role: "Online Assessment",
description:
"Generate all unique permutations of a string with duplicate characters.",
answer: "Backtracking with sorting and duplicate skipping",
tags: ["Backtracking","String"]
},

{
id: "deloitte-7",
company: "Deloitte",
title: "String Rotation Check",
difficulty: "Easy",
role: "Online Assessment",
description:
"Check if one string is a rotation of another.",
answer: "Check if S2 is substring of S1 + S1",
tags: ["String"]
},

{
id: "deloitte-8",
company: "Deloitte",
title: "Sum Digits Until Single Digit",
difficulty: "Easy",
role: "Online Assessment",
description:
"Repeatedly sum digits until a single digit remains.",
answer: "Use digital root formula",
tags: ["Math"]
},

{
id: "deloitte-9",
company: "Deloitte",
title: "Special Character Removal",
difficulty: "Easy",
role: "Online Assessment",
description:
"Remove special characters except spaces and count words.",
answer: "Regex filtering + split words",
tags: ["String"]
},

{
id: "deloitte-10",
company: "Deloitte",
title: "Subarrays with Odd Sum",
difficulty: "Medium",
role: "Online Assessment",
description:
"Count subarrays with odd sum.",
answer: "Use prefix parity counting",
tags: ["Array","Prefix Sum"]
},

{
id: "deloitte-11",
company: "Deloitte",
title: "Longest Palindromic Substring",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find length of longest palindrome substring.",
answer: "Expand around center",
tags: ["String"]
},

{
id: "deloitte-12",
company: "Deloitte",
title: "Merge K Sorted Arrays",
difficulty: "Medium",
role: "Online Assessment",
description:
"Merge multiple sorted arrays efficiently.",
answer: "Min heap / priority queue",
tags: ["Heap"]
},

{
id: "deloitte-13",
company: "Deloitte",
title: "Kth Largest Element",
difficulty: "Easy",
role: "Online Assessment",
description:
"Find kth largest element in an array.",
answer: "Min heap of size k",
tags: ["Heap"]
},

{
id: "deloitte-14",
company: "Deloitte",
title: "Count Inversions",
difficulty: "Hard",
role: "Online Assessment",
description:
"Count inversion pairs in array.",
answer: "Merge sort modification",
tags: ["Divide and Conquer"]
},

{
id: "deloitte-15",
company: "Deloitte",
title: "N Digit Prime Numbers",
difficulty: "Hard",
role: "Online Assessment",
description:
"Find N-digit primes where digit D occurs most frequently.",
answer: "Generate primes and filter by digit frequency",
tags: ["Math","Prime"]
},

{
id: "deloitte-16",
company: "Deloitte",
title: "Copycat in Exam",
difficulty: "Easy",
role: "Online Assessment",
description:
"Reverse characters of each word in sentence.",
answer: "Split words and reverse",
tags: ["String"]
},

{
id: "deloitte-17",
company: "Deloitte",
title: "Maximum Subarray Sum",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find maximum contiguous subarray sum.",
answer: "Kadane's Algorithm",
tags: ["Array"]
},

{
id: "deloitte-18",
company: "Deloitte",
title: "Anagram Check",
difficulty: "Easy",
role: "Online Assessment",
description:
"Check if two strings are anagrams.",
answer: "Character frequency count",
tags: ["String"]
},

{
id: "deloitte-19",
company: "Deloitte",
title: "Minimum Path Sum",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find minimum path sum in grid moving right or down.",
answer: "Dynamic Programming grid traversal",
tags: ["Dynamic Programming","Grid"]
},

{
id: "deloitte-20",
company: "Deloitte",
title: "Valid Parentheses",
difficulty: "Easy",
role: "Online Assessment",
description:
"Check if parentheses string is valid.",
answer: "Stack matching brackets",
tags: ["Stack"]
},

{
id: "deloitte-21",
company: "Deloitte",
title: "Missing Number",
difficulty: "Easy",
role: "Online Assessment",
description:
"Find missing number from range 0 to N.",
answer: "Use sum formula or XOR",
tags: ["Array"]
},

{
id: "deloitte-22",
company: "Deloitte",
title: "Reverse Linked List",
difficulty: "Easy",
role: "Online Assessment",
description:
"Reverse a singly linked list.",
answer: "Iterative pointer reversal",
tags: ["Linked List"]
},

{
id: "deloitte-23",
company: "Deloitte",
title: "Two Sum",
difficulty: "Easy",
role: "Online Assessment",
description:
"Find indices of two numbers adding to target.",
answer: "HashMap lookup",
tags: ["Array","HashMap"]
},

{
id: "deloitte-24",
company: "Deloitte",
title: "Longest Increasing Subsequence",
difficulty: "Medium",
role: "Online Assessment",
description:
"Find length of LIS.",
answer: "Binary search DP method",
tags: ["Dynamic Programming"]
},

{
id: "deloitte-25",
company: "Deloitte",
title: "Graph Cycle Detection",
difficulty: "Medium",
role: "Online Assessment",
description:
"Detect cycle in undirected graph.",
answer: "DFS with parent tracking or Union Find",
tags: ["Graph"]
},

{
id: "deloitte-26",
company: "Deloitte",
title: "Rotate Array",
difficulty: "Easy",
role: "Online Assessment",
description:
"Rotate array to the right by k steps.",
answer: "Reverse array method",
tags: ["Array"]
}

]