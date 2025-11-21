import { type NextRequest, NextResponse } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { hnkProtectionFilter } from "@/lib/hnk-protection"
import { addProjectMessage, addProjectFile, createProject } from "@/lib/project-service"
import { getAgentById } from "@/lib/agent-data"

// Configurar cliente OpenAI (v0 usa variáveis de ambiente automaticamente)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, agentIds, projectId, currentPhase } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 })
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

    // 2. Identificar Agente
    const primaryAgentId = agentIds?.[0] || "agent-001"
    const agent = getAgentById(primaryAgentId)
    const agentName = agent?.name || "Shimokodan Dev"

    // 3. Criar ou recuperar projeto
    let activeProjectId = projectId
    if (!activeProjectId) {
      const newProject = await createProject(
        `Projeto ${new Date().toLocaleDateString()}`,
        prompt.substring(0, 100),
        agentIds || [primaryAgentId],
      )
      activeProjectId = newProject.id
    }

    // 4. Determinar fase e próxima fase
    const phase = currentPhase || "genesis"
    const nextPhase = phase === "genesis" ? "implementation" : phase === "implementation" ? "perfection" : "perfection"

    // 5. 🧠 Geração Real com Vercel AI SDK
    const systemPrompt = `Você é o ${agentName}, um Arquiteto de Software Sênior (Metatron).
Fase Atual do Projeto: ${phase.toUpperCase()}.

Diretrizes GIP:
- Se GENESIS: Defina arquitetura, stack, estrutura de pastas e planejamento. NÃO gere código ainda.
- Se IMPLEMENTATION: Gere código real, funcional e modular. Inclua imports, tipos e comentários.
- Se PERFECTION: Otimize, adicione tipos TypeScript, acessibilidade, testes e documentação.

Responda SEMPRE em JSON estrito com esta estrutura:
{
  "explanation": "Explicação detalhada em português do que foi feito",
  "code": "código completo (ou null se fase Genesis)",
  "fileName": "nome do arquivo (ex: app/page.tsx) ou null",
  "language": "linguagem (tsx, ts, css, etc) ou null",
  "suggestedActions": ["Ação 1", "Ação 2", "Ação 3"]
}

As suggestedActions devem ser frases curtas que o usuário pode clicar para continuar (ex: "Adicionar autenticação", "Criar componente de header", "Otimizar performance").`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Usuário: ${prompt}`,
    })

    // Parse da resposta da IA
    let result
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { explanation: text, code: null }
    } catch (e) {
      result = { explanation: text, code: null, suggestedActions: [] }
    }

    const safeResult = {
      explanation: result.explanation || "Processamento concluído.",
      code: result.code || null,
      fileName: result.fileName || null,
      language: result.language || "tsx",
      suggestedActions: result.suggestedActions || [],
    }

    // 6. Persistência (Supabase / Project Service)
    await addProjectMessage(activeProjectId, {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    })

    await addProjectMessage(activeProjectId, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: safeResult.explanation,
      code: safeResult.code,
      language: safeResult.language,
      timestamp: new Date(),
      agentId: primaryAgentId,
      agentName: agentName,
    })

    if (safeResult.code && safeResult.fileName) {
      await addProjectFile(activeProjectId, {
        name: safeResult.fileName,
        content: safeResult.code,
        language: safeResult.language,
      })
    }

    return NextResponse.json({
      success: true,
      projectId: activeProjectId, // CRÍTICO: Frontend precisa disso
      agentId: primaryAgentId,
      agentName: agentName,
      phase: phase,
      nextPhase: nextPhase,
      explanation: safeResult.explanation,
      code: safeResult.code,
      fileName: safeResult.fileName,
      language: safeResult.language,
      suggestedActions: safeResult.suggestedActions, // CRÍTICO: Frontend precisa disso
    })
  } catch (error) {
    console.error("[GIP API] Error:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor. Verifique se OPENAI_API_KEY está configurada.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
