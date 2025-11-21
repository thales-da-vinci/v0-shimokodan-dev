import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Clock, FileCode, Layers } from "lucide-react"
import Link from "next/link"
import { getAllProjects } from "@/lib/project-service"

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your AI-generated applications and codebases</p>
        </div>
        <Link href="/dashboard/studio">
          <Button>
            <FolderOpen className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={project.status === "completed" ? "default" : "secondary"}
                    className={
                      project.status === "completed" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""
                    }
                  >
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {project.currentPhase} Phase
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileCode className="h-4 w-4" />
                      <span>{project.files.length} files</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <div className="flex -space-x-2">
                      {project.agentIds.map((id, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-[10px] text-white font-bold"
                        >
                          A
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">+ {project.messages.length} interactions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-center">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Start a new project in the AI Studio to see it here.</p>
            <Link href="/dashboard/studio">
              <Button>Go to Studio</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
