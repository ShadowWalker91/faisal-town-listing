"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client" // <-- Use the Browser Client
import { Home, LayoutDashboard, Building2, Plus, Users, Map, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient() // <-- Initialize client

  const handleLogout = async () => {
    // 1. Sign out using the browser client (clears cookies)
    await supabase.auth.signOut()
    
    // 2. Refresh to clear any cached data
    router.refresh()
    
    // 3. Redirect to the main website (Home)
    router.push("/")
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
        
        {/* HEADER */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b800ff]">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-foreground">Faisal Town</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
        
        {/* NAVIGATION */}
        <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          <Link
            href="/admin/properties"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Building2 className="h-4 w-4" />
            Properties
          </Link>

          <Link
            href="/admin/properties/new"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>

          <Link
            href="/admin/agents"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            Manage Agents
          </Link>

          <Link
            href="/admin/sectors"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Map className="h-4 w-4" />
            Manage Sectors
          </Link>
          
          <hr className="my-4 border-border" />
          
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            View Website
          </Link>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

      </aside>
      
      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 bg-slate-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}