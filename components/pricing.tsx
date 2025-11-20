"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success!",
      description: `Welcome to ${selectedPlan}! Check your email for next steps.`,
    })

    setIsDialogOpen(false)
    setName("")
    setEmail("")
  }

  const plans = [
    {
      name: "Slime Initiate",
      price: "R$29",
      description: "Perfect for personal productivity and basic tasks.",
      features: ["1 Specialized Agent", "Basic Memory", "Standard Response Speed", "Level Cap: 10"],
    },
    {
      name: "Evolved Guardian",
      price: "R$89",
      description: "For professionals needing reliable automation.",
      features: [
        "3 Specialized Agents",
        "Extended Context Window",
        "Fast Response Speed",
        "Level Cap: 50",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Demon Lord",
      price: "R$149",
      description: "Enterprise-grade power for scaling businesses.",
      features: ["Unlimited Agents", "Full Memory Recall", "Instant Processing", "No Level Cap", "API Access"],
    },
  ]

  return (
    <>
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Choose Your Guardian</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Select the power level of your Shimokodan agent. Upgrade as your needs evolve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.popular ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "bg-background"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground text-pretty">{plan.description}</p>
                </div>
                <ul className="mb-8 space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <Check className="mr-3 h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"}`}
                >
                  Summon Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Summon {selectedPlan}</DialogTitle>
            <DialogDescription>Enter your details to begin your evolution journey.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Complete Summoning
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}
