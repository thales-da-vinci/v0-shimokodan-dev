import { agentsDatabase } from "./agent-data"

export interface AgentMemory {
  agentId: string
  experience: number
  level: number
  successfulTasks: number
  knowledgeBase: string[] // Learned patterns/concepts
  recentProjects: string[]
}

// Initialize memories from the static agent database
const agentMemories: Record<string, AgentMemory> = {}

export function initializeMemories() {
  if (Object.keys(agentMemories).length === 0) {
    agentsDatabase.forEach((agent) => {
      agentMemories[agent.id] = {
        agentId: agent.id,
        experience: agent.xp,
        level: agent.level,
        successfulTasks: agent.stats.tasksCompleted,
        knowledgeBase: ["Basic code generation", "Error handling patterns", "React component structure"],
        recentProjects: [],
      }
    })
  }
}

export function getAgentMemory(agentId: string): AgentMemory | undefined {
  initializeMemories()
  return agentMemories[agentId]
}

export function addExperience(agentId: string, amount: number): AgentMemory | undefined {
  initializeMemories()
  const memory = agentMemories[agentId]
  if (!memory) return undefined

  memory.experience += amount

  // Simple leveling logic: 100 XP per level
  const newLevel = Math.floor(memory.experience / 100)
  if (newLevel > memory.level) {
    memory.level = newLevel
    // Add a new "learned" concept on level up (simulated)
    memory.knowledgeBase.push(`Advanced pattern level ${newLevel}`)
  }

  memory.successfulTasks += 1
  return memory
}

export function recordProjectInteraction(agentId: string, projectId: string, context: string) {
  initializeMemories()
  const memory = agentMemories[agentId]
  if (!memory) return

  if (!memory.recentProjects.includes(projectId)) {
    memory.recentProjects.push(projectId)
  }

  // "Learn" from the context
  if (context.length > 10 && !memory.knowledgeBase.includes(context)) {
    memory.knowledgeBase.push(context)
  }
}
