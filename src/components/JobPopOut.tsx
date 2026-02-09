"use client"

import { useState } from 'react'
import { createClient } from '@/lib/client'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Calendar, 
  User, 
  Building2, 
  FileText,
  PoundSterling
} from "lucide-react"

interface JobPopOutProps {
  job: any
  onClose: () => void
  onUpdate: () => void
}

export default function JobPopOut({ job, onClose, onUpdate }: JobPopOutProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  if (!job) return null

  const updateStatus = async (newStatus: 'pending' | 'complete') => {
    setLoading(true)
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', job.id)

    if (!error) onUpdate()
    setLoading(false)
    onClose()
  }

  const deleteJob = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return
    setLoading(true)
    const { error } = await supabase.from('jobs').delete().eq('id', job.id)
    if (!error) onUpdate()
    setLoading(false)
    onClose()
  }

  return (
    <Sheet open={!!job} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-slate-950 text-slate-50 border-slate-800 p-0 overflow-y-auto">
        {/* Decorative Top Bar */}
        <div className={`h-1.5 w-full ${job.status === 'complete' ? 'bg-green-500' : 'bg-orange-500'}`} />
        
        <div className="p-8 space-y-8">
          <SheetHeader className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={job.status === 'complete' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-orange-500 text-orange-500 bg-orange-500/10'}>
                {job.status === 'complete' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                {job.status.toUpperCase()}
              </Badge>
              {job.is_recurring && (
                <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-none">
                  <Calendar className="mr-1 h-3 w-3" /> MONTHLY
                </Badge>
              )}
            </div>

            <div className="flex items-start gap-4">
              {job.logo_url ? (
                <img src={job.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-900" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Building2 className="text-slate-700 w-8 h-8" />
                </div>
              )}
              <div>
                <SheetTitle className="text-3xl font-bold text-slate-50 tracking-tight leading-none">
                  {job.business_name || job.title}
                </SheetTitle>
                <SheetDescription className="text-slate-500 mt-2 flex items-center gap-2">
                  <User className="h-3 w-3" /> {job.customer_name || "Unknown Customer"}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Project Revenue</p>
              <div className="flex items-center text-2xl font-bold text-slate-50">
                <PoundSterling className="h-5 w-5 mr-1 text-green-500" />
                {Number(job.cost).toLocaleString('en-GB')}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Created Date</p>
              <div className="text-lg font-medium text-slate-300">
                {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
              <FileText className="h-4 w-4" />
              Design Brief
            </div>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-inner">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed italic text-sm">
                "{job.details || "No project brief provided."}"
              </p>
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 w-full p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            className="flex-1 text-slate-500 hover:text-red-400 hover:bg-red-400/10" 
            onClick={deleteJob}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Project
          </Button>

          {job.status === 'pending' ? (
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20" 
              onClick={() => updateStatus('complete')}
              disabled={loading}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Complete
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white" 
              onClick={() => updateStatus('pending')}
              disabled={loading}
            >
              <Clock className="mr-2 h-4 w-4" /> Restore to Pending
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}