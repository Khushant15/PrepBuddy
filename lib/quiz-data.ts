export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  topic: "DSA" | "DBMS" | "OS" | "OOPS" | "Web" | "Aptitude"
  duration: number
  difficulty: "Easy" | "Medium" | "Hard"
  questions: QuizQuestion[]
}

export const quizzes: Quiz[] = [

  // ================= DSA =================

  {
    id: "dsa-core",
    title: "DSA Core Interview Questions",
    description: "Real DSA questions asked in technical interviews",
    topic: "DSA",
    duration: 25,
    difficulty: "Medium",

    questions: [

      {
        id: "dsa1",
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1,
        explanation: "Binary search halves search space each iteration.",
      },

      {
        id: "dsa2",
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Heap", "Graph"],
        correctAnswer: 1,
        explanation: "Stack follows Last In First Out.",
      },

      {
        id: "dsa3",
        question: "Which traversal gives sorted order in BST?",
        options: ["Preorder", "Postorder", "Inorder", "Level order"],
        correctAnswer: 2,
        explanation: "Inorder traversal of BST returns sorted values.",
      },

      {
        id: "dsa4",
        question: "Worst case complexity of QuickSort?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        correctAnswer: 3,
        explanation: "Occurs when pivot produces unbalanced partitions.",
      },

      {
        id: "dsa5",
        question: "Which structure is used in BFS?",
        options: ["Stack", "Queue", "Heap", "Tree"],
        correctAnswer: 1,
        explanation: "Queue ensures level-wise traversal.",
      },

      {
        id: "dsa6",
        question: "Time complexity of accessing array element?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Array index access is constant time.",
      },

    ],

  },


  // ================= DBMS =================

  {
    id: "dbms-core",
    title: "DBMS Interview Questions",
    description: "Database concepts frequently asked in interviews",
    topic: "DBMS",
    duration: 20,
    difficulty: "Medium",

    questions: [

      {
        id: "dbms1",
        question: "Which normal form removes transitive dependency?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: 2,
        explanation: "3NF removes transitive dependencies.",
      },

      {
        id: "dbms2",
        question: "Which key uniquely identifies a record?",
        options: ["Foreign key", "Primary key", "Candidate key", "Composite key"],
        correctAnswer: 1,
        explanation: "Primary key uniquely identifies record.",
      },

      {
        id: "dbms3",
        question: "SQL command used to retrieve data?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correctAnswer: 2,
        explanation: "SELECT retrieves records.",
      },

    ],

  },


  // ================= OS =================

  {
    id: "os-core",
    title: "Operating System Interview Questions",
    description: "Core OS concepts for interviews",
    topic: "OS",
    duration: 20,
    difficulty: "Medium",

    questions: [

      {
        id: "os1",
        question: "What is a process?",
        options: [
          "Program in execution",
          "Program file",
          "Memory block",
          "None"
        ],
        correctAnswer: 0,
        explanation: "Process is executing instance of program.",
      },

      {
        id: "os2",
        question: "Which scheduling algorithm is preemptive?",
        options: [
          "FCFS",
          "SJF",
          "Round Robin",
          "FIFO"
        ],
        correctAnswer: 2,
        explanation: "Round Robin is preemptive.",
      },

    ],

  },


  // ================= OOPS =================

  {
    id: "oops-core",
    title: "OOPS Interview Questions",
    description: "Object-oriented programming interview concepts",
    topic: "OOPS",
    duration: 15,
    difficulty: "Easy",

    questions: [

      {
        id: "oops1",
        question: "What is encapsulation?",
        options: [
          "Data hiding",
          "Inheritance",
          "Polymorphism",
          "Abstraction"
        ],
        correctAnswer: 0,
        explanation: "Encapsulation hides internal state.",
      },

      {
        id: "oops2",
        question: "Which supports runtime polymorphism?",
        options: [
          "Function overloading",
          "Function overriding",
          "Constructor",
          "Destructor"
        ],
        correctAnswer: 1,
        explanation: "Function overriding enables runtime polymorphism.",
      },

    ],

  },


  // ================= WEB =================

  {
    id: "web-core",
    title: "Web Development Interview Questions",
    description: "Frontend and backend web interview concepts",
    topic: "Web",
    duration: 15,
    difficulty: "Easy",

    questions: [

      {
        id: "web1",
        question: "Which HTTP method retrieves data?",
        options: ["POST", "GET", "PUT", "DELETE"],
        correctAnswer: 1,
        explanation: "GET retrieves resources.",
      },

      {
        id: "web2",
        question: "Which status code means success?",
        options: ["200", "404", "500", "403"],
        correctAnswer: 0,
        explanation: "200 means success.",
      },

    ],

  },


  // ================= APTITUDE =================

  {
    id: "aptitude-core",
    title: "Logical Reasoning Interview Questions",
    description: "Logical and aptitude interview questions",
    topic: "Aptitude",
    duration: 15,
    difficulty: "Medium",

    questions: [

      {
        id: "apt1",
        question: "If A > B and B > C, then?",
        options: [
          "A > C",
          "C > A",
          "A = C",
          "Cannot determine"
        ],
        correctAnswer: 0,
        explanation: "Transitive property.",
      },

    ],

  },

]
