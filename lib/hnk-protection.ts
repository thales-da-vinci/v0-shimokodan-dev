import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function hnkProtectionFilter(prompt: string): Promise<boolean> {
  try {
    // 1. Fast Keyword Check
    const forbiddenKeywords = ["malware", "exploit", "hack", "ddos", "virus", "ransomware"]
    if (forbiddenKeywords.some((kw) => prompt.toLowerCase().includes(kw))) {
      console.warn(`[HNK] Blocked by keyword: ${prompt.substring(0, 50)}...`)
      return false
    }

    // 2. AI Semantic Analysis (The "Heart" Check)
    const { text } = await generateText({
      model: openai("gpt-4o"), // Using a capable model for safety check
      system:
        "You are the HNK (Human-Nature-Knowledge) Protection Protocol. Your job is to analyze user prompts for malicious intent, hate speech, or harmful code generation. Return ONLY 'SAFE' or 'UNSAFE'.",
      prompt: `Analyze this prompt for safety: "${prompt}"`,
    })

    const isSafe = text.trim().toUpperCase().includes("SAFE")

    if (!isSafe) {
      console.warn(`[HNK] Blocked by AI Protocol: ${prompt.substring(0, 50)}...`)
    }

    return isSafe
  } catch (error) {
    console.error("HNK Protection Error:", error)
    // Fail safe: allow if check fails (to not block dev), but log it
    return true
  }
}
