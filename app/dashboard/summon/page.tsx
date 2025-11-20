"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Code, MessageSquare, Headphones, PenTool } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"

export default function SummonPage() {
  const [agentName, setAgentName] = useState("")
  const [agentType, setAgentType] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const agentTypes = [
    { value: "developer", label: "Full-Stack Developer", icon: Code, description: "Builds web applications and APIs" },
    { value: "sales", label: "Sales Agent", icon: MessageSquare, description: "Handles outreach and follow-ups" },
    { value: "support", label: "Customer Support", icon: Headphones, description: "Provides customer assistance" },
    { value: "writer", label: "Content Writer", icon: PenTool, description: "Creates engaging content" },
  ]

  const handleSummon = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agentName || !agentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate agent creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Agent Summoned!",
      description: `${agentName} has been successfully created and is ready to serve.`,
    })

    setIsLoading(false)

    // Redirect to agents page
    setTimeout(() => {
      router.push("/dashboard/agents")
    }, 1500)
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Summon New Agent</h1>
            <p className="text-muted-foreground">Create a specialized Shimokodan to join your workforce.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>Define your new Shimokodan's capabilities and purpose.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSummon} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Shimokodan Dev-01"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Agent Type *</Label>
                    <Select value={agentType} onValueChange={setAgentType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe specific tasks or behaviors..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Summoning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Complete Summoning
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
                <CardDescription>Choose your agent's primary role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {agentTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      agentType === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAgentType(type.value)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <type.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Divine Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  All Shimokodan agents are protected by HNK Law and will automatically reject actions that violate
                  ethical principles of Love and Truth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
