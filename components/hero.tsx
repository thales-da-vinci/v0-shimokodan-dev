"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const handleScrollToFeatures = () => {
    const element = document.getElementById("features")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-accent/10 to-background opacity-50" />
      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>O Futuro de
          Agentes-como-Serviço
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mb-6 text-balance">
          Evolua Sua{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Força de Trabalho Digital
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-10 text-pretty">
          Implante agentes autônomos Shimokodan que programam, vendem e suportam. Eles não apenas conversam—eles
          trabalham, evoluem e aderem aos mais altos padrões éticos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-primary hover:bg-primary/90">
              Iniciar Evolução <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            onClick={handleScrollToFeatures}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-lg h-12 px-8 border-primary/20 hover:bg-primary/10 bg-transparent"
          >
            Ver Capacidades
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl w-full">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-secondary/30 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dev Full-Stack</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Especialistas em Next.js + Node.js que constroem aplicações completas.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-secondary/30 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ação Autônoma</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Agentes que executam tarefas, gerenciam agendas e fecham negócios.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-secondary/30 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Núcleo Ético</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Protegido pela Lei HNK: Sempre submisso ao Amor e à Verdade.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
