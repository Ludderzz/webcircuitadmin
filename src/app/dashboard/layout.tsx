"use client"

import { createClient } from '@/lib/client'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Settings, Layers } from "lucide-react"
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Helper to highlight the active tab
  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Layers className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-slate-50">
                WebCircuit<span className="text-blue-500">.</span>
              </span>
            </Link>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                  isActive('/dashboard') 
                  ? 'text-slate-50 bg-slate-800' 
                  : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </Link>
              
              <Link 
                href="/dashboard/settings" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                  isActive('/dashboard/settings') 
                  ? 'text-slate-50 bg-slate-800' 
                  : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Admin Access</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  )
}