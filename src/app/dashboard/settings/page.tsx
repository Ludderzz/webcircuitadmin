"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Mail, Database, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">System Settings</h1>
        <p className="text-slate-400">Manage your admin configuration and application preferences.</p>
      </header>

      <div className="grid gap-6">
        {/* Admin Profile Section */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-slate-50">Admin Profile</CardTitle>
            </div>
            <CardDescription className="text-slate-500">
              Your account details for WebCircuit access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <Input id="email" value="admin@webcircuit.com" disabled className="bg-slate-950 border-slate-800 pl-10 text-slate-500" />
              </div>
            </div>
            <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
              Request Password Reset
            </Button>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              <CardTitle className="text-slate-50">Regional Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-slate-200">Base Currency</p>
                <p className="text-xs text-slate-500">Currently locked to British Pound Sterling</p>
              </div>
              <span className="text-xl font-bold text-slate-50">£ GBP</span>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Database className="w-3 h-3 text-slate-500" />
                    Supabase Connection
                  </span>
                  <span className="text-xs text-slate-500">Database & Storage active</span>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-800 text-slate-500">v1.0.4</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Badge({ children, className, variant }: any) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${className}`}>
      {children}
    </span>
  )
}