import { Suspense } from 'react'
import { createClient } from '@/lib/server'
import StatsCards from '@/components/StatsCards'
import ManualEntry from '@/components/ManualEntry'
import JobTable from '@/components/JobTable'
import { VercelMonitor } from '@/components/VercelMonitor'
// 1. IMPORT THE NEW COMPONENT
import LighthouseAudit from '@/components/LightHouseAudit'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  const allJobs = jobs || []

  const vercelToken = process.env.VERCEL_TOKEN || ""
  const ntfyTopic = process.env.NTFY_TOPIC || "admindashboard"
  const ntfyToken = process.env.NTFY_TOKEN || ""
 

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              WebCircuit Command
            </h1>
            <p className="text-slate-400 mt-1">Real-time performance for Top Gear Driving Academy</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Live</span>
          </div>
        </header>

        {/* TOP ROW: Revenue Stats */}
        <StatsCards jobs={allJobs} />

        {/* 2. NEW: WEB CIRCUIT LIGHTHOUSE REPORTER (STANDALONE) */}
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">WebCircuit Intelligence Reporter</h2>
            <LighthouseAudit />
        </section>
            
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Management & Infrastructure */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-slate-900/50 border border-slate-900 rounded-2xl overflow-hidden">
                <JobTable jobs={allJobs} />
             </div>
             
             <VercelMonitor 
                key={vercelToken} 
                vercelToken={vercelToken} 
                ntfyTopic={ntfyTopic} 
                ntfyToken={ntfyToken} 
             />
          </div>

          {/* RIGHT: Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-8">
                <ManualEntry />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}