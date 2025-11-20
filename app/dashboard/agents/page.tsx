"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { getAllAgents } from "@/lib/agent-data"

export default function AgentsPage() {
  const agents = getAllAgents()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="text-muted-foreground">Manage and deploy your Shimokodan workforce.</p>
        </div>
        <Link href="/dashboard/summon">
          <Button className="bg-primary hover:bg-primary/90">
            <Sparkles className="mr-2 h-4 w-4" />
            Summon New Agent
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link key={agent.id} href={`/dashboard/agents/${agent.id}`}>
            <Card className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-16 w-16 rounded-xl bg-gradient-to-br ${agent.avatarColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                  >
                    {agent.name[0]}
                  </div>
                  <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                </div>
                <CardTitle className="text-xl">{agent.name}</CardTitle>
                <CardDescription>{agent.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Level</span>
                  <span className="font-bold text-primary text-lg">Lvl {agent.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Token ID</span>
                  <span className="text-xs font-mono">{agent.tokenId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-bold text-green-500">{agent.stats.successRate}%</span>
                </div>
                <Button variant="ghost" className="w-full justify-between group" asChild>
                  <div>
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
