import { createClient } from '@/lib/server'
import StatsCards from '@/components/StatsCards'
import ManualEntry from '@/components/ManualEntry'
import JobTable from '@/components/JobTable'
import { VercelMonitor } from '@/components/VercelMonitor'

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
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">WebCircuit Admin</h1>
          <p className="text-slate-400">Project management and revenue tracking overview.</p>
        </header>

        <StatsCards jobs={allJobs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Main Activity (Table + Vercel) */}
          <div className="lg:col-span-2 space-y-8">
             <JobTable jobs={allJobs} />
             
             {/* Vercel Monitor now sits under the Job Table */}
             <VercelMonitor 
               key={vercelToken} 
               vercelToken={vercelToken} 
               ntfyTopic={ntfyTopic} 
               ntfyToken={ntfyToken} 
             />
          </div>

          {/* RIGHT COLUMN: Entry & Actions */}
          <div className="lg:col-span-1">
            <ManualEntry />
          </div>
        </div>
      </div>
    </div>
  )
}