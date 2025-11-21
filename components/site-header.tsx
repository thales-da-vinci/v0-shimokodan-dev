"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setIsOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-sm" />
          </div>
          <span className="text-lg font-bold tracking-tight">Shimokodan Dev</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => handleScrollTo("features")} className="transition-colors hover:text-primary">
            Capacidades
          </button>
          <button onClick={() => handleScrollTo("pricing")} className="transition-colors hover:text-primary">
            Planos
          </button>
          <Link href="/dashboard" className="transition-colors hover:text-primary">
            Painel
          </Link>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => handleScrollTo("features")}
                className="text-left py-2 text-lg transition-colors hover:text-primary"
              >
                Capacidades
              </button>
              <button
                onClick={() => handleScrollTo("pricing")}
                className="text-left py-2 text-lg transition-colors hover:text-primary"
              >
                Planos
              </button>
              <Link
                href="/dashboard"
                className="text-left py-2 text-lg transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Painel
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Invocar Agente
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
