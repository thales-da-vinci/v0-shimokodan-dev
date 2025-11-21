"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, Sparkles, Code, Loader2, Copy, Check, Download, ArrowRight } from "lucide-react"
import { getAllAgents } from "@/lib/agent-data"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useSearchParams } from "next/navigation"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  agentId?: string
  agentName?: string
  code?: string
  language?: string
  phase?: string
}

export default function StudioPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [projectId, setProjectId] = useState<string | null>(searchParams.get("projectId"))
  const [currentPhase, setCurrentPhase] = useState<"genesis" | "implementation" | "perfection">("genesis")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Welcome to Shimokodan AI Studio! I'm ready to help you build. We'll follow the GIP method:\n\n1. Genesis (Planning)\n2. Implementation (Coding)\n3. Perfection (Refinement)\n\nDescribe what you want to build to start the Genesis phase.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["agent-001"])
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [suggestedActions, setSuggestedActions] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const agents = getAllAgents()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Load project history if projectId exists
  useEffect(() => {
    if (projectId) {
      // In a real app, fetch project details here
      // For demo, we'll just simulate a loaded state
      toast({
        title: "Project Loaded",
        description: "Continuing from previous session...",
      })
    }
  }, [projectId, toast])

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => (prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]))
  }

  const copyCode = (code: string, messageId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(messageId)
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard",
    })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Code Downloaded",
      description: `${filename} has been downloaded`,
    })
  }

  const handleActionClick = (action: string) => {
    setInput(action)
    // Optional: auto-submit
    // handleSubmit(new Event('submit') as any)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || selectedAgents.length === 0 || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSuggestedActions([])
    setIsProcessing(true)

    try {
      // Call the AI Studio API
      const response = await fetch("/api/studio/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          agentIds: selectedAgents,
          projectId,
          currentPhase,
        }),
      })

      if (!response.ok) throw new Error("Failed to process request")

      const data = await response.json()

      // Update project state
      if (data.projectId) setProjectId(data.projectId)
      if (data.nextPhase) setCurrentPhase(data.nextPhase)
      if (data.suggestedActions) setSuggestedActions(data.suggestedActions)

      // Add agent response with code
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.explanation,
        timestamp: new Date(),
        agentId: data.agentId,
        agentName: data.agentName,
        code: data.code,
        language: data.language,
        phase: data.phase,
      }

      setMessages((prev) => [...prev, assistantMessage])

      toast({
        title: "Task Completed",
        description: `${data.agentName} has completed your request`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              AI Studio
            </h1>
            <p className="text-muted-foreground mt-1">Build with GIP Method: Genesis • Implementation • Perfection</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`h-8 px-3 text-sm capitalize ${
                currentPhase === "genesis"
                  ? "border-blue-500 text-blue-500"
                  : currentPhase === "implementation"
                    ? "border-purple-500 text-purple-500"
                    : "border-emerald-500 text-emerald-500"
              }`}
            >
              {currentPhase} Phase
            </Badge>
            {projectId && (
              <Badge variant="secondary" className="h-8 px-3 text-sm">
                Project Active
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Agent Selection Sidebar */}
          <Card className="lg:col-span-1 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Select Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedAgents.includes(agent.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleAgent(agent.id)}
                    >
                      <Checkbox checked={selectedAgents.includes(agent.id)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg bg-gradient-to-br ${agent.avatarColor} flex items-center justify-center text-white font-bold text-sm mb-2`}
                        >
                          {agent.name[0]}
                        </div>
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Lv {agent.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-3 flex flex-col border-primary/20">
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-6">
                  {messages.map((message) => (
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
                        className={`flex-1 max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : message.role === "system" ? "bg-accent/20 border border-accent" : "bg-secondary"} rounded-lg p-4`}
                      >
                        {message.agentName && (
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-primary">{message.agentName}</p>
                            {message.phase && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1">
                                {message.phase}
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.code && (
                          <div className="mt-4 rounded-lg bg-black/90 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/10">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-emerald-400" />
                                <span className="text-xs text-white/70">{message.language || "code"}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-white/70 hover:text-white"
                                  onClick={() => copyCode(message.code!, message.id)}
                                >
                                  {copiedCode === message.id ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-white/70 hover:text-white"
                                  onClick={() =>
                                    downloadCode(message.code!, `shimokodan-${Date.now()}.${message.language}`)
                                  }
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <pre className="p-4 overflow-x-auto">
                              <code className="text-xs text-emerald-400">{message.code}</code>
                            </pre>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          U
                        </div>
                      )}
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Processing your request...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Suggested Actions */}
              {suggestedActions.length > 0 && !isProcessing && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t bg-secondary/10">
                  {suggestedActions.map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap text-xs bg-transparent"
                      onClick={() => handleActionClick(action)}
                    >
                      {action}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe what you want to build... (e.g., 'Create a todo app with Next.js and Tailwind')"
                    className="min-h-[60px] max-h-[120px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedAgents.length} agent{selectedAgents.length !== 1 ? "s" : ""} selected • Press Enter to send,
                  Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  )
}
