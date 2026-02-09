"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Building2, ArrowUpRight, Repeat, Briefcase, Zap, Clock, CheckCircle, Search } from "lucide-react"
import JobPopOut from './JobPopOut'

interface JobTableProps {
  jobs: any[]
}

export default function JobTable({ jobs }: JobTableProps) {
  const router = useRouter()
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [statusFilter, setStatusFilter] = useState<'pending' | 'complete'>('pending')
  const [showOnlyRecurring, setShowOnlyRecurring] = useState(false)

  const handleUpdate = () => {
    router.refresh()
  }

  // Multi-layer filter: Status -> Type -> Search Query
  const filteredJobs = jobs.filter(job => {
    const matchesStatus = job.status === statusFilter
    const matchesRecurring = showOnlyRecurring ? job.is_recurring : true
    
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      (job.business_name?.toLowerCase() || job.title?.toLowerCase() || "").includes(searchLower) ||
      (job.customer_name?.toLowerCase() || "").includes(searchLower)

    return matchesStatus && matchesRecurring && matchesSearch
  })

  const recurringTotal = jobs
    .filter(j => j.is_recurring && j.status === statusFilter)
    .reduce((sum, j) => sum + Number(j.cost), 0)

  return (
    <div className="w-full space-y-6 group">
      <div className="flex flex-col gap-4">
        {/* Search Bar Row */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search business or customer name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/50"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs 
            value={statusFilter} 
            className="w-full sm:w-auto" 
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <TabsList className="bg-slate-900 border border-slate-800 p-1">
              <TabsTrigger value="pending" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-500 gap-2">
                <Clock className="w-3.5 h-3.5" />
                Pending ({jobs.filter(j => j.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="complete" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Complete ({jobs.filter(j => j.status === 'complete').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs 
            value={showOnlyRecurring ? "recurring" : "all"} 
            className="w-full sm:w-auto" 
            onValueChange={(v) => setShowOnlyRecurring(v === "recurring")}
          >
            <TabsList className="bg-slate-900 border border-slate-800 p-1">
              <TabsTrigger value="all" className="gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                All Projects
              </TabsTrigger>
              <TabsTrigger value="recurring" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2">
                <Repeat className="w-3.5 h-3.5" />
                Recurring
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {showOnlyRecurring && (
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              {statusFilter} MRR: £{recurringTotal.toLocaleString('en-GB')}
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-900/80">
            <TableRow className="hover:bg-transparent border-slate-800">
              <TableHead className="text-slate-500 font-semibold uppercase text-[11px] tracking-wider py-4 px-6">
                Client & Project
              </TableHead>
              <TableHead className="text-slate-500 font-semibold uppercase text-[11px] tracking-wider py-4">
                Revenue
              </TableHead>
              <TableHead className="text-slate-500 font-semibold uppercase text-[11px] tracking-wider py-4 text-right px-6">
                Type
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-slate-500 italic">
                  {searchQuery 
                    ? `No results found for "${searchQuery}"` 
                    : `No ${showOnlyRecurring ? 'recurring' : ''} ${statusFilter} projects found.`
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer border-slate-800/50 hover:bg-blue-500/[0.03] transition-all duration-200 group/row"
                  onClick={() => setSelectedJob(job)}
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {job.logo_url ? (
                          <img 
                            src={job.logo_url} 
                            alt="" 
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-slate-800 group-hover/row:border-blue-500/50 transition-colors" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/row:border-blue-500/50 transition-colors">
                            <Building2 className="text-slate-500 w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 group-hover/row:text-blue-400 transition-colors flex items-center gap-1">
                          {job.business_name || job.title}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/row:opacity-100 transition-all transform translate-y-1 group-hover/row:translate-y-0" />
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {job.customer_name || "Direct Client"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-mono font-medium text-slate-300">
                    <span className="text-green-500/80 mr-0.5 text-xs">£</span>
                    {Number(job.cost).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    {job.is_recurring ? (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2 py-0.5 rounded-md">
                        <Repeat className="w-3 h-3 mr-1" />
                        Monthly
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500 border-slate-800 bg-transparent px-2 py-0.5 rounded-md">
                        Project
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <JobPopOut 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onUpdate={handleUpdate}
      />
    </div>
  )
}