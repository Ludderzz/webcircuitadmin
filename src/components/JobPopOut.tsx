"use client"

import { useState, useEffect } from 'react'
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
import { Input } from "@/components/ui/input"
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Calendar, 
  User, 
  Building2, 
  FileText,
  PoundSterling,
  Edit2,
  Save,
  Globe,
  ExternalLink,
  Zap 
} from "lucide-react"

interface JobPopOutProps {
  job: any
  onClose: () => void
  onUpdate: () => void
}

export default function JobPopOut({ job, onClose, onUpdate }: JobPopOutProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Edit States
  const [editCost, setEditCost] = useState('')
  const [editWebsite, setEditWebsite] = useState('')

  // Reset states when job changes
  useEffect(() => {
    if (job) {
      setEditCost(job.cost?.toString() || '0')
      setEditWebsite(job.website_url || '')
      setIsEditing(false)
    }
  }, [job])

  if (!job) return null

  const handleSave = async () => {
    setLoading(true)
    
    // 1. Generate the automated screenshot URL
    const autoScreenshot = editWebsite 
      ? `https://api.microlink.io/?url=${encodeURIComponent(editWebsite)}&screenshot=true&meta=false&embed=screenshot.url`
      : ''

    // 2. Update Supabase
    const { error } = await supabase
      .from('jobs')
      .update({ 
        cost: Number(editCost),
        website_url: editWebsite,
        screenshot_url: autoScreenshot
      })
      .eq('id', job.id)

    if (!error) {
      // 3. Trigger the parent refresh
      await onUpdate() 
      setIsEditing(false)
    } else {
      console.error("Error saving:", error.message)
      alert("Failed to save changes.")
    }
    setLoading(false)
  }

  const updateStatus = async (newStatus: 'pending' | 'complete') => {
    setLoading(true)
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', job.id)

    if (!error) await onUpdate()
    setLoading(false)
    onClose()
  }

  const deleteJob = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return
    setLoading(true)
    const { error } = await supabase.from('jobs').delete().eq('id', job.id)
    if (!error) await onUpdate()
    setLoading(false)
    onClose()
  }

  return (
    <Sheet open={!!job} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-slate-950 text-slate-50 border-slate-800 p-0 overflow-y-auto">
        <div className={`h-1.5 w-full ${job.status === 'complete' ? 'bg-green-500' : 'bg-orange-500'}`} />
        
        <div className="p-8 space-y-8">
          <SheetHeader className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={job.status === 'complete' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-orange-500 text-orange-500 bg-orange-500/10'}>
                {job.status === 'complete' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                {job.status.toUpperCase()}
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : <><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Details</>}
              </Button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Building2 className="text-slate-700 w-8 h-8" />
              </div>
              <div>
                <SheetTitle className="text-3xl font-bold text-slate-50 tracking-tight leading-none">
                  {job.business_name || "New Project"}
                </SheetTitle>
                <SheetDescription className="text-slate-500 mt-2 flex items-center gap-2">
                  <User className="h-3 w-3" /> {job.customer_name || "No Client Name"}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* REVENUE BOX */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Revenue</p>
              {isEditing ? (
                <div className="relative">
                  <PoundSterling className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    type="number" 
                    value={editCost} 
                    onChange={(e) => setEditCost(e.target.value)}
                    className="pl-8 bg-slate-950 border-slate-700 h-9"
                  />
                </div>
              ) : (
                <div className="text-2xl font-bold text-slate-50">
                  £{Number(job.cost || 0).toLocaleString('en-GB')}
                </div>
              )}
            </div>
            
            {/* WEBSITE LINK BOX */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Website Link</p>
              {isEditing ? (
                <div className="relative">
                  <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="https://..." 
                    value={editWebsite} 
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="pl-8 bg-slate-950 border-slate-700 h-9"
                  />
                </div>
              ) : (
                <div className="truncate text-sm">
                  {job.website_url ? (
                    <a href={job.website_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                      {new URL(job.website_url).hostname} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">No link</span>
                  )}
                </div>
              )}
            </div>

            {/* AUTOMATED PREVIEW STATUS */}
            <div className="col-span-2 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Portfolio Showcase Status</p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {isEditing ? (
                    editWebsite ? (
                      <span className="text-blue-400 flex items-center gap-2">
                        <Zap className="w-3 h-3 animate-pulse" /> Auto-generating preview...
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">Link required for preview</span>
                    )
                  ) : (
                    job.screenshot_url ? (
                      <span className="text-green-500 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Preview Ready
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">No preview generated</span>
                    )
                  )}
                </div>
                {job.screenshot_url && !isEditing && (
                  <Badge variant="outline" className="text-[10px] border-blue-500/50 text-blue-400">
                    LIVE ON PORTFOLIO
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Update & Sync Preview"}
            </Button>
          )}

          <Separator className="bg-slate-800" />

          <div className="space-y-3 pb-32">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
              <FileText className="h-4 w-4" /> Design Brief
            </div>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-sm text-slate-300 italic">
              "{job.details || "No details provided."}"
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 w-full p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 gap-3">
          <Button variant="ghost" className="flex-1 text-slate-500 hover:text-red-400" onClick={deleteJob} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button 
            className={`flex-1 ${job.status === 'pending' ? 'bg-blue-600' : 'bg-slate-800'}`} 
            onClick={() => updateStatus(job.status === 'pending' ? 'complete' : 'pending')} 
            disabled={loading}
          >
            {job.status === 'pending' ? 'Mark Complete' : 'Restore Pending'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}