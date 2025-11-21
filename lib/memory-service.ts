import { supabase } from "./supabase"
import { agentsDatabase } from "./agent-data"

export interface AgentMemory {
  agentId: string
  experience: number
  level: number
  successfulTasks: number
  knowledgeBase: string[]
  recentProjects: string[]
}

export async function getAgentMemory(agentId: string): Promise<AgentMemory | undefined> {
  try {
    // Fetch agent stats from DB
    const { data: agentData, error } = await supabase.from("agents").select("*").eq("id", agentId).single()

    if (error || !agentData) {
      // Fallback to static data if not in DB yet
      const staticAgent = agentsDatabase.find((a) => a.id === agentId)
      if (staticAgent) {
        return {
          agentId: staticAgent.id,
          experience: staticAgent.xp,
          level: staticAgent.level,
          successfulTasks: staticAgent.stats.tasksCompleted,
          knowledgeBase: ["Basic code generation"],
          recentProjects: [],
        }
      }
      return undefined
    }

    // Fetch memories/knowledge
    const { data: memories } = await supabase
      .from("memories")
      .select("context")
      .eq("agent_id", agentId)
      .eq("type", "learning")
      .limit(10)

    return {
      agentId: agentData.id,
      experience: agentData.xp,
      level: agentData.level,
      successfulTasks: agentData.tasks_completed,
      knowledgeBase: memories?.map((m) => m.context) || [],
      recentProjects: [], // Could fetch from project relations
    }
  } catch (e) {
    console.error("Error fetching agent memory:", e)
    return undefined
  }
}

export async function addExperience(agentId: string, amount: number): Promise<void> {
  try {
    // Get current stats
    const { data: agent } = await supabase
      .from("agents")
      .select("xp, level, tasks_completed")
      .eq("id", agentId)
      .single()

    if (agent) {
      const newXp = agent.xp + amount
      const newLevel = Math.floor(newXp / 100)
      const tasksCompleted = agent.tasks_completed + 1

      // Update agent
      await supabase
        .from("agents")
        .update({
          xp: newXp,
          level: newLevel > agent.level ? newLevel : agent.level,
          tasks_completed: tasksCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq("id", agentId)

      // Log level up if happened
      if (newLevel > agent.level) {
        await supabase.from("memories").insert({
          agent_id: agentId,
          context: `Leveled up to ${newLevel}`,
          type: "achievement",
          importance: 5,
        })
      }
    }
  } catch (e) {
    console.error("Error adding experience:", e)
  }
}

export async function recordProjectInteraction(agentId: string, projectId: string, context: string) {
  try {
    await supabase.from("memories").insert({
      agent_id: agentId,
      project_id: projectId,
      context: context,
      type: "interaction",
      importance: 1,
    })
  } catch (e) {
    console.error("Error recording interaction:", e)
  }
}
