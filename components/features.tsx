import { Brain, GitBranch, Layers, Lock } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-20 bg-secondary/10">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Inteligência Evolutiva</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Agentes Shimokodan não são estáticos. Eles ganham experiência, desbloqueiam novas habilidades e se adaptam
            às suas necessidades específicas de negócio ao longo do tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Brain,
              title: "Aprendizado Adaptativo",
              description:
                "Agentes aprendem com cada interação, tornando-se mais eficientes em seus fluxos de trabalho específicos.",
            },
            {
              icon: GitBranch,
              title: "Árvores de Habilidades",
              description:
                "Desbloqueie habilidades especializadas conforme seu agente sobe de nível, desde programação avançada até vendas persuasivas.",
            },
            {
              icon: Layers,
              title: "Enxames Multi-Agente",
              description: "Coordene múltiplos Shimokodans para lidar com projetos complexos em perfeita sincronia.",
            },
            {
              icon: Lock,
              title: "Proteção Divina",
              description:
                "Restrições éticas integradas garantem que todas as ações estejam alinhadas com princípios benevolentes.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border bg-background p-6 hover:border-primary/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
