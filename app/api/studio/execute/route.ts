import { type NextRequest, NextResponse } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { hnkProtectionFilter } from "@/lib/hnk-protection"
import { addProjectMessage, addProjectFile } from "@/lib/project-service"

// Configurar cliente OpenAI (v0 usa variáveis de ambiente automaticamente)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, agentIds, projectId, currentPhase } = await request.json()

    if (!prompt || !projectId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // 1. 🛡️ Proteção Crística (HNK Protocol)
    const isSafe = await hnkProtectionFilter(prompt)
    if (!isSafe) {
      return NextResponse.json(
        {
          error: "Intenção bloqueada pelo Protocolo HNK (Lei do Amor e Segurança).",
        },
        { status: 403 },
      )
    }

    // 2. Identificar Agente e Contexto
    // Aqui você buscaria o agente real no Supabase.
    // Por enquanto, simulamos o nome para o prompt do sistema.
    const agentName = "Shimokodan Dev"

    // 3. 🧠 Geração Real com Vercel AI SDK
    const systemPrompt = `Você é o ${agentName}, um Arquiteto de Software Sênior (Metatron).
    Fase Atual do Projeto: ${currentPhase || "GENESIS"}.
    
    Diretrizes GIP:
    - Se GENESIS: Defina arquitetura, stack e estrutura de pastas.
    - Se IMPLEMENTATION: Gere código real, funcional e modular.
    - Se PERFECTION: Otimize, adicione tipos e acessibilidade.
    
    Responda sempre em JSON estrito com: { "explanation": string, "code": string | null, "fileName": string | null, "language": string }`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Usuário: ${prompt}`,
    })

    // Parse da resposta da IA (assumindo que ela obedeceu o JSON)
    // Em produção, usaríamos 'generateObject' ou zod para garantir o formato.
    let result
    try {
      // Tentativa simples de extrair JSON caso a IA coloque texto em volta
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { explanation: text, code: null }
    } catch (e) {
      result = { explanation: text, code: null }
    }

    // 4. Persistência (Supabase / Project Service)
    // Salvar mensagem do usuário
    await addProjectMessage(projectId, {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    })

    // Salvar resposta da IA
    await addProjectMessage(projectId, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result.explanation,
      code: result.code,
      language: result.language || "markdown",
      timestamp: new Date(),
    })

    // Se houve código, salvar arquivo
    if (result.code && result.fileName) {
      await addProjectFile(projectId, {
        name: result.fileName,
        content: result.code,
        language: result.language || "tsx",
      })
    }

    return NextResponse.json({
      success: true,
      explanation: result.explanation,
      code: result.code,
    })
  } catch (error) {
    console.error("[GIP API] Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
