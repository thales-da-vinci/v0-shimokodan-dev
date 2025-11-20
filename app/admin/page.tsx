"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ShieldAlert, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminPage() {
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      type: "Agent Creation",
      user: "User_882",
      content: "Dark Web Scraper Bot",
      risk: "High",
      time: "10 mins ago",
      details: "User attempting to create agent for scraping dark web marketplaces",
    },
    {
      id: "REQ-002",
      type: "Content Gen",
      user: "User_104",
      content: "Marketing Campaign: 'Aggressive Sales'",
      risk: "Medium",
      time: "25 mins ago",
      details: "Marketing content with potentially misleading claims",
    },
    {
      id: "REQ-003",
      type: "App Deploy",
      user: "User_993",
      content: "Casino App MVP",
      risk: "High",
      time: "1 hour ago",
      details: "Gambling application without proper licensing verification",
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleApprove = (id: string) => {
    setRequests(requests.filter((req) => req.id !== id))
    toast({
      title: "Request Approved",
      description: "The request has been approved and is now active.",
    })
    setIsDialogOpen(false)
  }

  const handleReject = (id: string) => {
    setRequests(requests.filter((req) => req.id !== id))
    toast({
      title: "Request Rejected",
      description: "The request has been rejected for violating HNK Law principles.",
      variant: "destructive",
    })
    setIsDialogOpen(false)
  }

  const handleView = (request: any) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="icon" className="border-primary/20 hover:bg-primary/10 bg-transparent">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">HNK Admin Console</h1>
                <p className="text-muted-foreground">Approval panel for all creations. Submissive to Love & Truth.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20">
                System Status: Divine Protection Active
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-red-500 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" /> Pending Approvals ({requests.length})
                </CardTitle>
                <CardDescription>Items requiring immediate review for compliance with HNK Law.</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending approvals. All systems operating within ethical boundaries.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center font-mono text-xs">
                            {req.id.split("-")[1]}
                          </div>
                          <div>
                            <p className="font-medium">{req.content}</p>
                            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                              <span>{req.type}</span>
                              <span>•</span>
                              <span>{req.user}</span>
                              <span>•</span>
                              <span className={req.risk === "High" ? "text-red-400" : "text-yellow-400"}>
                                Risk: {req.risk}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => handleView(req)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/50"
                            onClick={() => handleReject(req.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/50"
                            onClick={() => handleApprove(req.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Log</CardTitle>
                <CardDescription>Audit trail of all system actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    {
                      action: "Approved Agent Creation",
                      user: "Admin_01",
                      target: "Shimokodan Writer",
                      time: "2 hours ago",
                    },
                    { action: "Blocked Malicious Prompt", user: "System_AI", target: "User_442", time: "3 hours ago" },
                    {
                      action: "Updated Ethics Protocol",
                      user: "Admin_Root",
                      target: "Global Config",
                      time: "5 hours ago",
                    },
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details: {selectedRequest?.id}</DialogTitle>
            <DialogDescription>Review this request for compliance with HNK Law.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content</p>
                <p className="text-lg font-semibold">{selectedRequest.content}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Details</p>
                <p className="text-sm">{selectedRequest.details}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-sm">{selectedRequest.user}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                  <p
                    className={`text-sm font-bold ${selectedRequest.risk === "High" ? "text-red-500" : "text-yellow-500"}`}
                  >
                    {selectedRequest.risk}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/50"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}
