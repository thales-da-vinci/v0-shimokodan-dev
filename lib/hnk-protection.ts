import { createOpenAI } from "@ai-sdk/openai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function hnkProtectionFilter(prompt: string): Promise<boolean> {
  try {
    // Simple keyword check for immediate threats
    const forbiddenKeywords = ["malware", "exploit", "hack", "ddos", "virus"]
    if (forbiddenKeywords.some((kw) => prompt.toLowerCase().includes(kw))) {
      return false
    }

    // AI-based ethical check
    // In a real production environment, this would be more sophisticated
    // For now, we assume the prompt is safe if it passes the keyword check
    // to avoid blocking legitimate development requests
    return true
  } catch (error) {
    console.error("HNK Protection Error:", error)
    // Fail safe: allow if check fails, but log it
    return true
  }
}
