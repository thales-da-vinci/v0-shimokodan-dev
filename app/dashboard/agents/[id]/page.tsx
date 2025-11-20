"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, Brain, Code, Zap, Clock, Target, Play, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getAgentById, type Agent, type AgentTask } from "@/lib/agent-data"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AgentDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [executingTask, setExecutingTask] = useState<string | null>(null)
  const [taskResults, setTaskResults] = useState<{ [key: string]: any }>({})
  const [taskParams, setTaskParams] = useState<{ [key: string]: { [key: string]: string } }>({})

  useEffect(() => {
    if (params.id) {
      const foundAgent = getAgentById(params.id as string)
      if (foundAgent) {
        setAgent(foundAgent)
      }
    }
  }, [params.id])

  const executeTask = async (task: AgentTask) => {
    setExecutingTask(task.id)

    const params = taskParams[task.id] || {}

    toast({
      title: "Task Started",
      description: `${agent?.name} is executing: ${task.name}`,
    })

    try {
      const response = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent?.id,
          taskId: task.id,
          parameters: params,
        }),
      })

      if (!response.ok) throw new Error("Task execution failed")

      const result = await response.json()

      setTaskResults((prev) => ({ ...prev, [task.id]: result }))

      if (agent) {
        const newXp = Math.min(agent.xp + result.xpGained, agent.maxXp)
        setAgent({ ...agent, xp: newXp, stats: { ...agent.stats, tasksCompleted: agent.stats.tasksCompleted + 1 } })
      }

      toast({
        title: "Task Completed",
        description: `+${result.xpGained} XP earned!`,
      })
    } catch (error) {
      toast({
        title: "Task Failed",
        description: "Failed to execute task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExecutingTask(null)
    }
  }

  const handleParamChange = (taskId: string, paramName: string, value: string) => {
    setTaskParams((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [paramName]: value,
      },
    }))
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/agents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`h-16 w-16 rounded-xl bg-gradient-to-br ${agent.avatarColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
              >
                {agent.name[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
                <p className="text-muted-foreground">{agent.role}</p>
              </div>
            </div>
          </div>
          <Badge className="text-xs font-mono bg-primary/10 text-primary border-primary/20">{agent.tokenId}</Badge>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Level {agent.level}</CardTitle>
                <CardDescription>
                  {agent.xp} / {agent.maxXp} XP
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Next Level</div>
                <div className="text-xl font-bold text-primary">{agent.maxXp - agent.xp} XP</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(agent.xp / agent.maxXp) * 100} className="h-3" />
          </CardContent>
        </Card>

        <Tabs defaultValue="abilities">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="abilities">Abilities</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="abilities" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {agent.abilities.map((ability) => (
                <Card key={ability.id} className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          {ability.name}
                        </CardTitle>
                        <CardDescription className="mt-2">{ability.description}</CardDescription>
                      </div>
                      <Badge variant={ability.type === "active" ? "default" : "secondary"}>{ability.type}</Badge>
                    </div>
                  </CardHeader>
                  {(ability.cooldown || ability.energyCost) && (
                    <CardContent className="flex gap-4 text-sm">
                      {ability.cooldown && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {ability.cooldown}s cooldown
                        </div>
                      )}
                      {ability.energyCost && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Zap className="h-3 w-3" />
                          {ability.energyCost} energy
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            <div className="space-y-4">
              {agent.tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border-primary/20 ${executingTask === task.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Code className="h-4 w-4 text-primary" />
                          {task.name}
                        </CardTitle>
                        <CardDescription className="mt-2">{task.description}</CardDescription>
                        <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {task.difficulty}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          task.difficulty === "easy"
                            ? "secondary"
                            : task.difficulty === "medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {task.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Function: {task.function}()</p>
                      <div className="space-y-2">
                        {task.parameters.map((param) => (
                          <div key={param.name} className="grid gap-2">
                            <Label htmlFor={`${task.id}-${param.name}`} className="text-xs">
                              {param.name} <span className="text-muted-foreground">({param.type})</span>
                              {param.required && <span className="text-red-500">*</span>}
                            </Label>
                            {param.type.includes("|") ? (
                              <Select
                                onValueChange={(value) => handleParamChange(task.id, param.name, value)}
                                value={taskParams[task.id]?.[param.name] || ""}
                              >
                                <SelectTrigger id={`${task.id}-${param.name}`} className="h-8 text-xs">
                                  <SelectValue placeholder={`Select ${param.name}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {param.type.split("|").map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id={`${task.id}-${param.name}`}
                                placeholder={`Enter ${param.name}`}
                                className="h-8 text-xs"
                                value={taskParams[task.id]?.[param.name] || ""}
                                onChange={(e) => handleParamChange(task.id, param.name, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => executeTask(task)} disabled={executingTask === task.id}>
                      {executingTask === task.id ? (
                        <>
                          <Zap className="mr-2 h-4 w-4 animate-pulse" />
                          Executing...
                        </>
                      ) : taskResults[task.id] ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Execute Again
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Execute Task
                        </>
                      )}
                    </Button>
                    {taskResults[task.id] && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-green-600 font-medium">{taskResults[task.id].output}</p>
                        <p className="text-xs text-muted-foreground mt-1">+{taskResults[task.id].xpGained} XP</p>
                        {taskResults[task.id].details && (
                          <pre className="text-xs mt-2 p-2 bg-black/20 rounded overflow-x-auto">
                            {JSON.stringify(taskResults[task.id].details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 mt-6">
            {agent.skills.map((skill, i) => (
              <Card key={i} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Level {skill.level}/{skill.maxLevel}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
            <Button className="w-full bg-primary hover:bg-primary/90">
              <TrendingUp className="mr-2 h-4 w-4" />
              Upgrade Skills (500 XP)
            </Button>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-secondary/20">
                <CardHeader className="pb-2">
                  <CardDescription>Tasks Completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{agent.stats.tasksCompleted}</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/20">
                <CardHeader className="pb-2">
                  <CardDescription>Success Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{agent.stats.successRate}%</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/20">
                <CardHeader className="pb-2">
                  <CardDescription>Avg Response Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{agent.stats.avgResponseTime}</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/20">
                <CardHeader className="pb-2">
                  <CardDescription>Total Runtime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{agent.stats.totalRuntime}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token ID:</span>
                  <span className="font-mono font-bold text-primary">{agent.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{agent.metadata.created}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span>{agent.metadata.lastActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span>{agent.metadata.owner}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  )
}
