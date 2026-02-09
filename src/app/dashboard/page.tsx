import { createClient } from '@/lib/server'
import StatsCards from '@/components/StatsCards'
import ManualEntry from '@/components/ManualEntry'
import JobTable from '@/components/JobTable'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch all jobs once - the JobTable component now handles all the filtering
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  const allJobs = jobs || []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">WebCircuit Admin</h1>
          <p className="text-slate-400">Project management and revenue tracking overview.</p>
        </header>

        {/* Live data stats */}
        <StatsCards jobs={allJobs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tables Section - No more double Tabs here! */}
          <div className="lg:col-span-2">
             <JobTable jobs={allJobs} />
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1">
            <ManualEntry />
          </div>
        </div>
      </div>
    </div>
  )
}