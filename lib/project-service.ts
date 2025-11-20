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

// In-memory store for demo purposes
// In a real app, this would be a database
const projects: Project[] = [
  {
    id: "proj-001",
    name: "E-commerce Dashboard",
    description: "A modern dashboard for managing online store inventory and sales.",
    status: "completed",
    currentPhase: "perfection",
    messages: [],
    files: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    agentIds: ["agent-001", "agent-002"],
  },
]

export function getAllProjects(): Project[] {
  return projects
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function createProject(name: string, description: string, agentIds: string[]): Project {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name,
    description,
    status: "active",
    currentPhase: "genesis",
    messages: [],
    files: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    agentIds,
  }
  projects.push(newProject)
  return newProject
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return undefined

  projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() }
  return projects[index]
}

export function addProjectMessage(projectId: string, message: Message): Project | undefined {
  const project = getProjectById(projectId)
  if (!project) return undefined

  const updatedMessages = [...project.messages, message]
  return updateProject(projectId, { messages: updatedMessages })
}

export function addProjectFile(projectId: string, file: ProjectFile): Project | undefined {
  const project = getProjectById(projectId)
  if (!project) return undefined

  const updatedFiles = [...project.files, file]
  return updateProject(projectId, { files: updatedFiles })
}
