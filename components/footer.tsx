import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-secondary/20 py-12">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">Shimokodan Dev</span>
        </div>
        <div className="text-sm text-muted-foreground text-center md:text-right">
          <p>&copy; 2025 HNK Labs. All rights reserved.</p>
          <p className="mt-2">Built with Love & Truth.</p>
        </div>
      </div>
    </footer>
  )
}
