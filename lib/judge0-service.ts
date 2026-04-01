import axios from "axios";

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = "judge0-ce.p.rapidapi.com";

export const executeCode = async (sourceCode: string, languageId: number) => {
  if (!RAPID_API_KEY) {
    throw new Error("Missing RAPID_API_KEY for Judge0");
  }

  const options = {
    method: "POST",
    url: `https://${RAPID_API_HOST}/submissions`,
    params: { base64_encoded: "false", wait: "true", fields: "*" },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": RAPID_API_HOST,
      "Content-Type": "application/json",
    },
    data: {
      source_code: sourceCode,
      language_id: languageId,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: any) {
    console.error("Judge0 Error:", error.response?.data || error.message);
    throw new Error("Failed to execute code via Judge0");
  }
};

// Supported Languages (Common ones)
export const SUPPORTED_LANGUAGES = [
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 71, name: "Python (3.8.1)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
];
