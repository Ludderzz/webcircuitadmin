import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PoundSterling, Clock, CheckCircle, RefreshCcw, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  jobs: any[]
}

export default function StatsCards({ jobs }: StatsCardsProps) {
  const pendingCount = jobs.filter(j => j.status === 'pending').length
  const completeCount = jobs.filter(j => j.status === 'complete').length
  
  const totalRevenue = jobs
    .filter(j => j.status === 'complete')
    .reduce((sum, job) => sum + Number(job.cost), 0)

  const recurringRevenue = jobs
    .filter(j => j.is_recurring === true)
    .reduce((sum, job) => sum + Number(job.cost), 0)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue Card */}
      <Card className="relative overflow-hidden bg-slate-900/40 border-slate-800 hover:border-green-500/30 transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Total Revenue</CardTitle>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <PoundSterling className="w-4 h-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-slate-50 tracking-tight font-mono">
            <span className="text-green-500/50 text-xl mr-1">£</span>
            {totalRevenue.toLocaleString('en-GB')}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500/20">
              <TrendingUp className="w-2.5 h-2.5 text-green-500" />
            </div>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Gross Earnings</p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Jobs Card */}
      <Card className="relative overflow-hidden bg-slate-900/40 border-slate-800 hover:border-orange-500/30 transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Pipeline</CardTitle>
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-slate-50 tracking-tight">
            {pendingCount}
            <span className="text-slate-600 text-sm ml-2 font-medium uppercase tracking-tighter">Active</span>
          </div>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-3">Awaiting Completion</p>
        </CardContent>
      </Card>

      {/* Monthly Recurring Card */}
      <Card className="relative overflow-hidden bg-slate-900/40 border-slate-800 hover:border-blue-500/30 transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">MRR</CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <RefreshCcw className="w-4 h-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-slate-50 tracking-tight font-mono">
            <span className="text-blue-500/50 text-xl mr-1">£</span>
            {recurringRevenue.toLocaleString('en-GB')}
          </div>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-3">Monthly Recurring</p>
        </CardContent>
      </Card>

      {/* Completed Jobs Card */}
      <Card className="relative overflow-hidden bg-slate-900/40 border-slate-800 hover:border-slate-500/30 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Closed</CardTitle>
          <div className="p-2 bg-slate-800 rounded-lg">
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-slate-50 tracking-tight">
            {completeCount}
          </div>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-3">Projects Delivered</p>
        </CardContent>
      </Card>
    </div>
  )
}