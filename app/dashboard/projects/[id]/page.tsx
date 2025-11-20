"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileCode, MessageSquare, CheckCircle2, Circle, Download, Code, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getProjectById } from "@/lib/project-service"
import { useState } from "react"

export default function ProjectDetailPage() {
  const params = useParams()
  const project = getProjectById(params.id as string)
  const [activeTab, setActiveTab] = useState("overview")

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
        <Link href="/dashboard/projects">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    )
  }

  const phases = [
    { id: "genesis", name: "Genesis", description: "Planning & Architecture", status: "completed" },
    {
      id: "implementation",
      name: "Implementation",
      description: "Code Generation",
      status: project.currentPhase === "genesis" ? "pending" : "completed",
    },
    {
      id: "perfection",
      name: "Perfection",
      description: "Refinement & Polish",
      status: project.currentPhase === "perfection" ? "active" : "pending",
    },
  ]

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {project.name}
              <Badge variant="outline" className="ml-2 text-sm font-normal">
                {project.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">{project.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Project
          </Button>
          <Link href={`/dashboard/studio?projectId=${project.id}`}>
            <Button>
              Continue in Studio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:left-[15px] before:top-[10px] before:bottom-[10px] before:w-[2px] before:bg-border">
                {phases.map((phase, i) => (
                  <div key={phase.id} className="relative flex gap-4 items-start">
                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        phase.status === "completed"
                          ? "bg-primary border-primary text-primary-foreground"
                          : phase.status === "active"
                            ? "bg-background border-primary text-primary animate-pulse"
                            : "bg-background border-muted text-muted-foreground"
                      }`}
                    >
                      {phase.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="font-medium leading-none">{phase.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Files Generated</span>
                <span>{project.files.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Agents Used</span>
                <span>{project.agentIds.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="lg:col-span-3 flex flex-col border-primary/20">
          <div className="border-b px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent h-14 p-0 gap-6">
                <TabsTrigger
                  value="overview"
                  className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat History
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0"
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  Generated Files
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
            {activeTab === "overview" ? (
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {project.messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No messages yet. Start working in the Studio!
                    </div>
                  ) : (
                    project.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role !== "user" && (
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {message.agentName ? message.agentName[0] : "S"}
                          </div>
                        )}
                        <div
                          className={`flex-1 max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"} rounded-lg p-4`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.code && (
                            <div className="mt-4 rounded-lg bg-black/50 border border-white/10 p-3 flex items-center gap-2 text-xs font-mono text-emerald-400">
                              <Code className="h-4 w-4" />
                              Generated Code Snippet
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-2 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            ) : (
              <ScrollArea className="h-full p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {project.files.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">No files generated yet.</div>
                  ) : (
                    project.files.map((file, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="bg-secondary/50 px-4 py-2 border-b flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{file.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {file.language}
                          </Badge>
                        </div>
                        <div className="p-4 bg-black/90 overflow-x-auto">
                          <pre className="text-xs text-emerald-400 font-mono">{file.content.slice(0, 150)}...</pre>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
