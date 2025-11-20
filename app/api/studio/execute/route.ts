import { type NextRequest, NextResponse } from "next/server"
import { getAgentById } from "@/lib/agent-data"
import {
  createProject,
  getProjectById,
  addProjectMessage,
  addProjectFile,
  updateProject,
  type ProjectPhase,
} from "@/lib/project-service"
import { getAgentMemory, addExperience, recordProjectInteraction } from "@/lib/memory-service"

export async function POST(request: NextRequest) {
  try {
    const { prompt, agentIds, projectId, currentPhase } = await request.json()

    if (!prompt || !agentIds || agentIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Get or Create Project
    let project = projectId ? getProjectById(projectId) : null
    let activeProjectId = projectId

    if (!project) {
      const newProject = createProject(extractProjectName(prompt), prompt.substring(0, 100) + "...", agentIds)
      project = newProject
      activeProjectId = newProject.id
    }

    // 2. Add User Message
    addProjectMessage(activeProjectId!, {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    })

    // 3. Get Agent & Memory
    const agent = getAgentById(agentIds[0])
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    const memory = getAgentMemory(agent.id)

    // 4. Determine Phase & Logic
    let nextPhase: ProjectPhase = currentPhase || "genesis"
    const suggestedActions: string[] = []

    // Simple intent detection for phase transitions
    const lowerPrompt = prompt.toLowerCase()
    if (
      currentPhase === "genesis" &&
      (lowerPrompt.includes("start") || lowerPrompt.includes("code") || lowerPrompt.includes("implement"))
    ) {
      nextPhase = "implementation"
    } else if (
      currentPhase === "implementation" &&
      (lowerPrompt.includes("review") || lowerPrompt.includes("finish") || lowerPrompt.includes("polish"))
    ) {
      nextPhase = "perfection"
    }

    // Update project phase if changed
    if (nextPhase !== project.currentPhase) {
      updateProject(activeProjectId!, { currentPhase: nextPhase })
    }

    // 5. Generate Response based on GIP Phase
    const result = await generateGIPResponse(prompt, agent, nextPhase, memory)

    // 6. Update Agent Memory
    addExperience(agent.id, 15) // XP for interaction
    recordProjectInteraction(agent.id, activeProjectId!, prompt)

    // 7. Save Generated File (if any)
    if (result.code) {
      addProjectFile(activeProjectId!, {
        name: result.fileName || `generated-${Date.now()}.${result.language}`,
        content: result.code,
        language: result.language || "txt",
      })
    }

    // 8. Add Assistant Message
    addProjectMessage(activeProjectId!, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result.explanation,
      timestamp: new Date(),
      agentId: agent.id,
      agentName: agent.name,
      code: result.code,
      language: result.language,
      phase: nextPhase,
    })

    return NextResponse.json({
      projectId: activeProjectId,
      agentId: agent.id,
      agentName: agent.name,
      explanation: result.explanation,
      code: result.code,
      language: result.language,
      phase: nextPhase,
      suggestedActions: result.suggestedActions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Studio execution error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

async function generateGIPResponse(prompt: string, agent: any, phase: ProjectPhase, memory: any) {
  // Simulate "thinking" delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const lowerPrompt = prompt.toLowerCase()

  if (phase === "genesis") {
    return generateGenesisResponse(prompt, agent)
  } else if (phase === "implementation") {
    return generateImplementationResponse(prompt, agent)
  } else {
    return generatePerfectionResponse(prompt, agent)
  }
}

function generateGenesisResponse(prompt: string, agent: any) {
  const appName = extractProjectName(prompt)

  return {
    explanation: `I've analyzed your request for "${appName}". Based on the Genesis phase, here is the architectural plan:

**1. Core Requirements:**
- Modern Next.js 14 App Router structure
- Tailwind CSS for styling
- Responsive and accessible UI

**2. Proposed Structure:**
- \`app/page.tsx\`: Main landing/dashboard
- \`components/ui\`: Reusable shadcn/ui components
- \`lib/utils.ts\`: Helper functions

**3. Next Steps:**
I recommend we start by implementing the core layout and main page. Shall we proceed to the Implementation phase?`,
    code: null,
    language: null,
    suggestedActions: ["Proceed to Implementation", "Refine Requirements", "Generate Database Schema"],
  }
}

function generateImplementationResponse(prompt: string, agent: any) {
  // Reuse the existing code generation logic but wrapped in GIP context
  // For brevity, I'll include a simplified version of the previous logic here
  // In a real app, this would be much more complex

  let code = ""
  let explanation = ""
  let fileName = ""

  if (prompt.toLowerCase().includes("component")) {
    const name = "CustomComponent"
    fileName = "components/custom-component.tsx"
    code = `// components/${name}.tsx
"use client"
import { Card, CardContent } from "@/components/ui/card"

export function ${name}() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold">Generated Component</h2>
        <p className="text-muted-foreground">Created during Implementation Phase</p>
      </CardContent>
    </Card>
  )
}`
    explanation = `[Implementation Phase] I've generated the ${name} component. It's ready to be integrated into your application.`
  } else {
    const appName = extractProjectName(prompt)
    fileName = "app/page.tsx"
    code = `// app/page.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ${appName.replace(/\s+/g, "")}Page() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-4xl font-bold mb-4 text-primary">${appName}</h1>
      <p className="text-xl text-muted-foreground mb-8">Generated by Shimokodan Dev</p>
      
      <div className="flex gap-4">
        <Button onClick={() => setCount(c => c - 1)} variant="outline">-</Button>
        <span className="text-2xl font-mono w-12 text-center">{count}</span>
        <Button onClick={() => setCount(c => c + 1)}>+</Button>
      </div>
    </div>
  )
}`
    explanation = `[Implementation Phase] I've built the core application logic for ${appName}. The code includes state management and responsive UI.`
  }

  return {
    explanation,
    code,
    language: "tsx",
    fileName,
    suggestedActions: ["Generate another component", "Add styling details", "Proceed to Perfection Phase"],
  }
}

function generatePerfectionResponse(prompt: string, agent: any) {
  return {
    explanation: `[Perfection Phase] I've reviewed the code and applied the following optimizations:

1. **Performance**: Added 'use client' directives where necessary.
2. **Accessibility**: Ensured proper ARIA labels on interactive elements.
3. **Type Safety**: Verified TypeScript interfaces.

The application is now polished and ready for deployment!`,
    code: `// Optimized version
// Added proper types and accessibility attributes
interface Props {
  title: string;
}

export function OptimizedComponent({ title }: Props) {
  return (
    <div role="region" aria-label={title} className="p-4 border rounded-lg">
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  )
}`,
    language: "tsx",
    fileName: "optimized-component.tsx",
    suggestedActions: ["Deploy Application", "Start New Project", "Download Source Code"],
  }
}

function extractProjectName(prompt: string): string {
  const match = prompt.match(/(?:create|build|make)\s+(?:a|an)?\s*(\w+(?:\s+\w+)?)/i)
  return match ? match[1].trim() : "New Project"
}
