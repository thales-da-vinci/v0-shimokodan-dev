"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Code, MessageSquare, Zap, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Shimokodan Dev", role: "Full Stack Engineer", level: 12, status: "active" },
    { id: 2, name: "Shimokodan Sales", role: "Outbound Specialist", level: 5, status: "active" },
    { id: 3, name: "Shimokodan Support", role: "Customer Success", level: 8, status: "idle" },
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your Shimokodan agents and monitor their evolution.</p>
        </div>
        <Link href="/dashboard/summon">
          <Button className="bg-primary hover:bg-primary/90">
            <Zap className="mr-2 h-4 w-4" /> Summon Agent
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-secondary/20 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Code className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evolution Level</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Lvl 12</div>
            <p className="text-xs text-muted-foreground">Next perk at Lvl 15</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-background border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your agents have been busy.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { agent: "Dev-01", action: "Deployed Next.js App", time: "2 mins ago", status: "Success" },
                { agent: "Sales-Bot", action: "Sent 50 follow-ups", time: "1 hour ago", status: "Success" },
                { agent: "Writer-X", action: "Generated Blog Post", time: "3 hours ago", status: "Pending Review" },
                { agent: "Dev-01", action: "Fixed API Bug", time: "5 hours ago", status: "Success" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.agent}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === "Success"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-background border-border">
          <CardHeader>
            <CardTitle>Your Squad</CardTitle>
            <CardDescription>Manage your active Shimokodans.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <Link key={agent.id} href={`/dashboard/agents?id=${agent.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background font-bold">
                        {agent.name[0]}
                        <span
                          className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${agent.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-primary">Lvl {agent.level}</div>
                  </div>
                </Link>
              ))}
              <Link href="/dashboard/summon">
                <Button
                  variant="outline"
                  className="w-full border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 bg-transparent"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Summon New Agent
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
