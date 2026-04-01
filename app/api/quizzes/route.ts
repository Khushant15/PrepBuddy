import { NextResponse } from "next/server"
import axios from "axios"
import { checkRateLimit } from "@/lib/rate-limit"
import { getAuthUser } from "@/lib/auth-server"

const MOCK_QUIZZES: Record<string, any[]> = {
  "JavaScript": [
    { id: "js-1", question: "Which of the following is NOT a JavaScript data type?", options: ["Boolean", "Undefined", "Float", "Symbol"], correctAnswers: { answer_c_correct: "true" }, explanation: "JavaScript has Number (which covers both integers and floats), Boolean, String, Null, Undefined, Object, and Symbol.", difficulty: "Easy" },
    { id: "js-2", question: "What is 'hoisting' in JavaScript?", options: ["Lifting elements in the DOM", "Moving declarations to the top of their scope", "A performance optimization technique", "A way to handle asynchronous code"], correctAnswers: { answer_b_correct: "true" }, explanation: "Hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their containing scope during the compile phase.", difficulty: "Medium" },
    { id: "js-3", question: "What is the result of 'typeof null' in JavaScript?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correctAnswers: { answer_c_correct: "true" }, explanation: "This is a long-standing bug in JavaScript where null is incorrectly identified as an object.", difficulty: "Medium" },
    { id: "js-4", question: "Which keyword is used to declare a block-scoped variable in ES6?", options: ["var", "let", "global", "def"], correctAnswers: { answer_b_correct: "true" }, explanation: "'let' and 'const' provide block scoping, whereas 'var' is function-scoped.", difficulty: "Easy" },
    { id: "js-5", question: "What is a Closure in JavaScript?", options: ["A way to close the browser tab", "A function bundled together with its lexical environment", "A method to clear memory", "A type of loop"], correctAnswers: { answer_b_correct: "true" }, explanation: "A closure gives you access to an outer function's scope from an inner function.", difficulty: "Hard" },
    { id: "js-6", question: "What does the '===' operator check in JavaScript?", options: ["Only value equality", "Value and type equality", "Reference equality only", "None of the above"], correctAnswers: { answer_b_correct: "true" }, explanation: "The strict equality operator (===) checks both the value and the type of the operands.", difficulty: "Easy" },
    { id: "js-7", question: "How can you convert a string to an integer in JavaScript?", options: ["toInt()", "parseInt()", "Integer.parse()", "Number.toInt()"], correctAnswers: { answer_b_correct: "true" }, explanation: "The parseInt() function parses a string argument and returns an integer of the specified radix.", difficulty: "Easy" },
    { id: "js-8", question: "Which method is used to add an element at the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswers: { answer_a_correct: "true" }, explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.", difficulty: "Easy" },
    { id: "js-9", question: "What will 'console.log(2 + '2')' output?", options: ["4", "22", "NaN", "undefined"], correctAnswers: { answer_b_correct: "true" }, explanation: "JavaScript performs string concatenation when one of the operands is a string.", difficulty: "Medium" },
    { id: "js-10", question: "What is the use of 'NaN' in JavaScript?", options: ["To check if a value is null", "To represent 'Not-a-Number' result", "To represent infinity", "To represent an undefined object"], correctAnswers: { answer_b_correct: "true" }, explanation: "NaN (Not-a-Number) is a value that represents a result that is not a legal number.", difficulty: "Easy" },
    { id: "js-11", question: "Which of the following creates a promise in JavaScript?", options: ["new Promise()", "Promise.create()", "makePromise()", "new Async()"], correctAnswers: { answer_a_correct: "true" }, explanation: "The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.", difficulty: "Medium" },
    { id: "js-12", question: "What is the purpose of 'async' and 'await' in JavaScript?", options: ["To make code run faster", "To make asynchronous code look and behave more like synchronous code", "To handle DOM events", "To create multi-threaded programs"], correctAnswers: { answer_b_correct: "true" }, explanation: "Async functions and the await keyword enable asynchronous, promise-based behavior to be written in a cleaner style.", difficulty: "Hard" },
    { id: "js-13", question: "Which built-in method reverses the order of the elements of an array?", options: ["changeOrder()", "reverse()", "sort(reverse)", "None of the above"], correctAnswers: { answer_b_correct: "true" }, explanation: "The reverse() method reverses an array in place. The first array element becomes the last, and the last array element becomes the first.", difficulty: "Easy" },
    { id: "js-14", question: "How do you find the minimum of x and y in JavaScript?", options: ["min(x,y)", "Math.min(x,y)", "Math.low(x,y)", "lowest(x,y)"], correctAnswers: { answer_b_correct: "true" }, explanation: "The Math.min() static method returns the lowest-valued number passed into it.", difficulty: "Easy" },
    { id: "js-15", question: "What is the default value of an uninitialized variable in JavaScript?", options: ["null", "0", "undefined", "NaN"], correctAnswers: { answer_c_correct: "true" }, explanation: "A variable that has been declared but has not yet been assigned a value is 'undefined'.", difficulty: "Easy" }
  ],
  "React": [
    { id: "react-1", question: "What is the purpose of the 'useEffect' dependency array?", options: ["To store state values", "To control when the effect should re-run", "To define the return type of the component", "To handle form submissions"], correctAnswers: { answer_b_correct: "true" }, explanation: "The dependency array tells React to only re-run the effect if one of the values in the array has changed between renders.", difficulty: "Medium" },
    { id: "react-2", question: "What is JSX?", options: ["A JavaScript XML extension", "A type of database", "A CSS preprocessor", "A React state-management library"], correctAnswers: { answer_a_correct: "true" }, explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code within your JavaScript files.", difficulty: "Easy" },
    { id: "react-3", question: "Which hook would you use to store a persistent value that does not cause a re-render?", options: ["useState", "useMemo", "useRef", "useCallback"], correctAnswers: { answer_c_correct: "true" }, explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument. The returned object will persist for the full lifetime of the component and does not trigger re-renders.", difficulty: "Medium" },
    { id: "react-4", question: "What is 'Lifting State Up' in React?", options: ["Moving state to a higher component to share it", "Increasing the performance of state updates", "Removing state from a component", "Using Redux for all state"], correctAnswers: { answer_a_correct: "true" }, explanation: "Lifting state up involves moving the state to the closest common ancestor to share data between sibling components.", difficulty: "Medium" },
    { id: "react-5", question: "What is the Virtual DOM?", options: ["A backup of the real DOM", "A lightweight copy of the real DOM in memory", "A specific type of CSS grid", "The DOM used by Internet Explorer"], correctAnswers: { answer_b_correct: "true" }, explanation: "The Virtual DOM is a programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM by a library such as ReactDOM.", difficulty: "Hard" },
    { id: "react-6", question: "What is the purpose of React.memo?", options: ["To memorize component state", "To prevent unnecessary re-renders of functional components", "To handle component lifecycle", "To manage global state"], correctAnswers: { answer_b_correct: "true" }, explanation: "React.memo is a higher-order component that skips rendering a component if its props have not changed.", difficulty: "Hard" },
    { id: "react-7", question: "How do you pass data from a parent component to a child component?", options: ["Using state", "Using props", "Using context", "Using Redux"], correctAnswers: { answer_b_correct: "true" }, explanation: "Props (short for properties) are used to pass data from a parent component to its children.", difficulty: "Easy" },
    { id: "react-8", question: "What is the use of 'key' prop in lists?", options: ["To identify elements uniquely across renders", "To set the index of the element", "To style specific list items", "To link the item to a database ID"], correctAnswers: { answer_a_correct: "true" }, explanation: "Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity.", difficulty: "Medium" },
    { id: "react-9", question: "Which lifecycle method is replaced by useEffect with an empty dependency array?", options: ["componentDidMount", "componentDidUpdate", "componentWillUnmount", "render"], correctAnswers: { answer_a_correct: "true" }, explanation: "Using an empty dependency array [] in useEffect makes it run only once, similar to componentDidMount.", difficulty: "Medium" },
    { id: "react-10", question: "What is the default port for the development server in a standard Create React App project?", options: ["3000", "8080", "5000", "80"], correctAnswers: { answer_a_correct: "true" }, explanation: "The default port for CRA development server is 3000.", difficulty: "Easy" }
  ],
  "Python": [
    { id: "py-1", question: "How do you define a function in Python?", options: ["function myFunc():", "def myFunc():", "void myFunc() {}", "func myFunc()"], correctAnswers: { answer_b_correct: "true" }, explanation: "In Python, the 'def' keyword is used to define a function.", difficulty: "Easy" },
    { id: "py-2", question: "Which of the following is an immutable data type in Python?", options: ["List", "Dictionary", "Set", "Tuple"], correctAnswers: { answer_d_correct: "true" }, explanation: "Tuples are immutable, meaning their elements cannot be changed after creation.", difficulty: "Medium" },
    { id: "py-3", question: "What is a 'List Comprehension' in Python?", options: ["A way to summarize a list", "A concise way to create lists", "A method to sort a list", "A type of error handling"], correctAnswers: { answer_b_correct: "true" }, explanation: "List comprehensions provide a concise way to create lists based on existing lists or iterables.", difficulty: "Medium" },
    { id: "py-4", question: "Which keyword is used for exception handling in Python?", options: ["catch", "try", "throw", "error"], correctAnswers: { answer_b_correct: "true" }, explanation: "Python uses 'try' and 'except' blocks for handling exceptions.", difficulty: "Easy" },
    { id: "py-5", question: "What does the '__init__' method do in Python classes?", options: ["Initializes the class when imported", "The constructor method for object initialization", "Deletes the object", "Prints the object"], correctAnswers: { answer_b_correct: "true" }, explanation: "'__init__' is a special method that is called when an object is created from a class.", difficulty: "Medium" },
    { id: "py-6", question: "What is the output of 'print(type([]))'?", options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"], correctAnswers: { answer_a_correct: "true" }, explanation: "The type() function returns the type of the object. [] is a list.", difficulty: "Easy" },
    { id: "py-7", question: "Which method is used to add an element at the end of a list?", options: ["add()", "insert()", "append()", "push()"], correctAnswers: { answer_c_correct: "true" }, explanation: "The append() method adds a single item to the end of the list.", difficulty: "Easy" },
    { id: "py-8", question: "What is a decorator in Python?", options: ["A way to style the code", "A function that takes another function and extends its behavior", "A type of loop for lists", "A method to delete variables"], correctAnswers: { answer_b_correct: "true" }, explanation: "Decorators allow you to modify or enhance the behavior of functions or methods without changing their source code.", difficulty: "Hard" }
  ],
  "Java": [
    { id: "java-1", question: "What is the base class for all classes in Java?", options: ["Main", "Reference", "Object", "System"], correctAnswers: { answer_c_correct: "true" }, explanation: "The Object class is the parent class of all the classes in Java by default.", difficulty: "Easy" },
    { id: "java-2", question: "Which of these is NOT a wrapper class in Java?", options: ["Integer", "String", "Double", "Boolean"], correctAnswers: { answer_b_correct: "true" }, explanation: "String is a first-class object, not a wrapper for a primitive type.", difficulty: "Medium" },
    { id: "java-3", question: "What is the purpose of 'static' keyword?", options: ["To make a variable immutable", "To allow a method to be called without creating an instance", "To prevent a class from being inherited", "To handle memory allocation"], correctAnswers: { answer_b_correct: "true" }, explanation: "The static keyword means the member belongs to the type itself rather than to a specific instance of that type.", difficulty: "Medium" }
  ],
  "Node.js": [
    { id: "node-1", question: "Which module is used to create a web server in Node.js?", options: ["url", "path", "http", "fs"], correctAnswers: { answer_c_correct: "true" }, explanation: "The HTTP module can create an HTTP server that listens to server ports and gives a response back to the client.", difficulty: "Easy" },
    { id: "node-2", question: "What is the default engine used by Node.js?", options: ["SpiderMonkey", "Chakra", "V8", "Rhino"], correctAnswers: { answer_c_correct: "true" }, explanation: "Node.js is built on the V8 JavaScript engine, which is the same engine used in Google Chrome.", difficulty: "Easy" }
  ],
  "SQL": [
    { id: "sql-1", question: "Which SQL clause is used to filter results based on aggregate functions?", options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], correctAnswers: { answer_c_correct: "true" }, explanation: "The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.", difficulty: "Hard" },
    { id: "sql-2", question: "What is a PRIMARY KEY in a database?", options: ["A key that opens the database", "A unique identifier for each record in a table", "The most important table in the database", "A password for the database"], correctAnswers: { answer_b_correct: "true" }, explanation: "A primary key constraint uniquely identifies each record in a table.", difficulty: "Easy" },
    { id: "sql-3", question: "What is a JOIN in SQL?", options: ["Combining rows from two or more tables", "Adding a new member to the database", "Deleting redundant data", "Selecting data from a single table"], correctAnswers: { answer_a_correct: "true" }, explanation: "A JOIN clause is used to combine rows from two or more tables, based on a related column between them.", difficulty: "Medium" }
  ],
  "System Design": [
    { id: "sd-1", question: "What is horizontal scaling?", options: ["Adding more power to an existing server", "Adding more servers to handle the load", "Optimizing the database queries", "Using a Content Delivery Network"], correctAnswers: { answer_b_correct: "true" }, explanation: "Horizontal scaling (scaling out) means adding more machines into your pool of resources.", difficulty: "Medium" },
    { id: "sd-2", question: "What is a Load Balancer?", options: ["A device that increases server weight", "A system that distributes traffic across multiple servers", "A method to backup data", "A tool to measure internet speed"], correctAnswers: { answer_b_correct: "true" }, explanation: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.", difficulty: "Medium" }
  ],
  "Cloud": [
    { id: "cloud-1", question: "What does S3 stand for in AWS?", options: ["Simple Storage Service", "Secure System Solution", "Scalable Server Storage", "Synchronized Storage Space"], correctAnswers: { answer_a_correct: "true" }, explanation: "Amazon S3 stands for Simple Storage Service, providing object storage through a web service interface.", difficulty: "Easy" }
  ],
  "Frontend": [
    { id: "fe-1", question: "What is the CSS box model composed of?", options: ["Header, Main, Footer", "Content, Padding, Border, Margin", "Grid, Flex, Absolute, Static", "Font, Color, Background, Size"], correctAnswers: { answer_b_correct: "true" }, explanation: "In CSS, the term 'box model' is used when talking about design and layout. It consists of: content, padding, border, and margin.", difficulty: "Easy" }
  ],
  "Backend": [
    { id: "be-1", question: "What does JWT stand for?", options: ["Java Web Token", "JSON Web Token", "JavaScript Work Task", "Just Write Text"], correctAnswers: { answer_b_correct: "true" }, explanation: "JWT stands for JSON Web Token, a compact, URL-safe means of representing claims to be transferred between two parties.", difficulty: "Medium" }
  ],
  "General": [
    { id: "gen-1", question: "What does REST stand for in API design?", options: ["Representational State Transfer", "Remote Executive Service Task", "Rapid Enterprise Storage Tool", "Reactive System Template"], correctAnswers: { answer_a_correct: "true" }, explanation: "REST is an architectural style for designing networked applications.", difficulty: "Medium" },
    { id: "gen-2", question: "In Git, what does 'cherry-pick' do?", options: ["Deletes a commit", "Applies the changes from a specific commit to the current branch", "Merges two branches", "Creates a new branch from a commit"], correctAnswers: { answer_b_correct: "true" }, explanation: "Cherry-picking in Git allows you to pick an arbitrary commit by its reference and append it to the current HEAD.", difficulty: "Hard" },
    { id: "gen-3", question: "What is the purpose of a CDN?", options: ["To compile code", "To distribute content geographically to reduce latency", "To host databases", "To manage user authentication"], correctAnswers: { answer_b_correct: "true" }, explanation: "A Content Delivery Network (CDN) is a system of distributed servers that deliver web content to users based on their geographic location.", difficulty: "Medium" },
    { id: "gen-4", question: "What does HTTP status code 404 mean?", options: ["Server Error", "Found", "Not Found", "Unauthorized"], correctAnswers: { answer_c_correct: "true" }, explanation: "HTTP 404 Not Found response code indicates that the server cannot find the requested resource.", difficulty: "Easy" },
    { id: "gen-5", question: "What is the primary function of a Load Balancer?", options: ["To increase storage space", "To distribute incoming traffic across multiple servers", "To encrypt user data", "To speed up code execution"], correctAnswers: { answer_b_correct: "true" }, explanation: "A load balancer distributes incoming network traffic across a group of backend servers.", difficulty: "Easy" }
  ]
}

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })

    const rateLimit = checkRateLimit(user.uid, 20, 60000)
    if (!rateLimit.success) return NextResponse.json({ error: `Quota exceeded.` }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category") || "JavaScript"
    const difficulty = searchParams.get("difficulty") || "Medium"
    const limit = parseInt(searchParams.get("limit") || "10")

    const apiKey = process.env.QUIZ_API_KEY
    
    // Fail-Safe: Category-aware mock data
    const getFallbackData = (cat: string) => {
        const pool = MOCK_QUIZZES[cat] || MOCK_QUIZZES["General"]
        return pool.slice(0, limit) // Respect limit
    }

    if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
        return NextResponse.json(getFallbackData(category))
    }

    try {
        const response = await axios.get("https://quizapi.io/api/v1/questions", {
            params: { apiKey, category: "Programming", difficulty, limit },
            headers: { "X-Api-Key": apiKey, "Accept": "application/json" },
            timeout: 5000
        })

        if (!response.data || response.data.length === 0) return NextResponse.json(getFallbackData(category))

        const questions = response.data.map((q: any) => ({
            id: q.id,
            question: q.question,
            options: Object.values(q.answers).filter(a => a !== null),
            correctAnswers: q.correct_answers,
            explanation: q.explanation || "No explanation provided.",
            difficulty: q.difficulty,
            topic: q.category
        }))

        return NextResponse.json(questions)

    } catch (apiError: any) {
        console.error(`QUIZ API FAIL-SAFE: ${apiError.message}`)
        return NextResponse.json(getFallbackData(category))
    }

  } catch (error: any) {
    console.error("INTERNAL QUIZ ERROR:", error.message)
    return NextResponse.json(MOCK_QUIZZES["General"])
  }
}
