import { supabase } from "@/lib/supabase"
import type { Message } from "@/app/dashboard/studio/page"

export type ProjectPhase = "genesis" | "implementation" | "perfection"

export interface ProjectFile {
  name: string
  content: string
  language: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  currentPhase: ProjectPhase
  messages: Message[]
  files: ProjectFile[]
  createdAt: string
  updatedAt: string
  agentIds: string[]
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data.map(mapDatabaseProjectToProject)
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !data) {
    return undefined
  }

  return mapDatabaseProjectToProject(data)
}

export async function createProject(name: string, description: string, agentIds: string[]): Promise<Project> {
  const newProject = {
    name,
    description,
    status: "active",
    current_phase: "genesis",
    messages: [],
    files: [],
    agent_ids: agentIds,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("projects").insert(newProject).select().single()

  if (error) {
    throw new Error(`Error creating project: ${error.message}`)
  }

  return mapDatabaseProjectToProject(data)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
  const dbUpdates: any = {}
  if (updates.name) dbUpdates.name = updates.name
  if (updates.description) dbUpdates.description = updates.description
  if (updates.status) dbUpdates.status = updates.status
  if (updates.currentPhase) dbUpdates.current_phase = updates.currentPhase
  if (updates.messages) dbUpdates.messages = updates.messages
  if (updates.files) dbUpdates.files = updates.files

  dbUpdates.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from("projects").update(dbUpdates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating project:", error)
    return undefined
  }

  return mapDatabaseProjectToProject(data)
}

export async function addProjectMessage(projectId: string, message: Message): Promise<Project | undefined> {
  const project = await getProjectById(projectId)
  if (!project) return undefined

  const updatedMessages = [...project.messages, message]
  return updateProject(projectId, { messages: updatedMessages })
}

export async function addProjectFile(projectId: string, file: ProjectFile): Promise<Project | undefined> {
  const project = await getProjectById(projectId)
  if (!project) return undefined

  const updatedFiles = [...project.files, file]
  return updateProject(projectId, { files: updatedFiles })
}

function mapDatabaseProjectToProject(dbProject: any): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    status: dbProject.status,
    currentPhase: dbProject.current_phase,
    messages: dbProject.messages || [],
    files: dbProject.files || [],
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
    agentIds: dbProject.agent_ids || [],
  }
}
