"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  Sparkles,
  Users,
  ShieldAlert,
  MessageSquare,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/studio", label: "AI Studio", icon: MessageSquare },
    { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
    { href: "/dashboard/agents", label: "My Agents", icon: Users },
    { href: "/dashboard/summon", label: "Summon New", icon: PlusCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 border-r bg-secondary/10 hidden md:flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">Shimokodan</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  pathname === link.href && "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t">
          <Link href="/admin">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                pathname === "/admin" && "bg-primary/10 text-primary",
              )}
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Panel
            </Button>
          </Link>
        </div>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/20" />
          <div className="text-sm">
            <p className="font-medium">User</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
