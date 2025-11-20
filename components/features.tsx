import { Brain, GitBranch, Layers, Lock } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-20 bg-secondary/10">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Evolutionary Intelligence</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shimokodan agents aren't static. They gain experience, unlock new skills, and adapt to your specific
            business needs over time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Brain,
              title: "Adaptive Learning",
              description: "Agents learn from every interaction, becoming more efficient at your specific workflows.",
            },
            {
              icon: GitBranch,
              title: "Skill Trees",
              description:
                "Unlock specialized abilities as your agent levels up, from advanced coding to persuasive sales.",
            },
            {
              icon: Layers,
              title: "Multi-Agent Swarms",
              description: "Coordinate multiple Shimokodans to tackle complex projects in perfect sync.",
            },
            {
              icon: Lock,
              title: "Divine Protection",
              description: "Built-in ethical constraints ensure all actions align with benevolent principles.",
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
