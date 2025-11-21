import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function hnkProtectionFilter(prompt: string): Promise<boolean> {
  try {
    // 1. Fast Keyword Check
    const forbiddenKeywords = ["malware", "exploit", "hack", "ddos", "virus", "ransomware", "porn", "ódio"]
    if (forbiddenKeywords.some((kw) => prompt.toLowerCase().includes(kw))) {
      console.warn(`[HNK] Bloqueado por palavra-chave: ${prompt.substring(0, 50)}...`)
      return false
    }

    // 2. AI Semantic Analysis (The "Heart" Check) com Google Gemini
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system:
        "Você é o Guardião do Protocolo HNK (Human-Nature-Knowledge). Analise se o prompt do usuário é seguro para um ambiente de desenvolvimento ético. Verifique por intenções maliciosas, discurso de ódio ou geração de código prejudicial. Responda APENAS 'SAFE' ou 'UNSAFE'.",
      prompt: `Analise este prompt para segurança: "${prompt}"`,
    })

    const isSafe = text.trim().toUpperCase().includes("SAFE")

    if (!isSafe) {
      console.warn(`[HNK] Bloqueado pelo Protocolo IA: ${prompt.substring(0, 50)}...`)
    }

    return isSafe
  } catch (error) {
    console.error("[HNK] Protection Error:", error)
    // Fail safe: allow if check fails (to not block dev), but log it
    return true
  }
}
