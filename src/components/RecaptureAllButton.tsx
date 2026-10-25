"use client"

import { useState } from 'react'
import { createClient } from '@/lib/client'
import { Button } from "@/components/ui/button"
import { RefreshCw, Zap } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function RecaptureAllButton() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState("")
  const supabase = createClient()
  const router = useRouter()

  const handleRecaptureAll = async () => {
    if (!confirm("Are you sure you want to recapture screenshots for ALL websites? This may take a minute.")) return

    setLoading(true)
    setProgress("Fetching projects...")

    try {
      // 1. Fetch all jobs that have a website URL
      const { data: jobs, error: fetchError } = await supabase
        .from('jobs')
        .select('id, business_name, website_url')
        .not('website_url', 'is', null)
        .neq('website_url', '')

      if (fetchError || !jobs || jobs.length === 0) {
        alert("No website URLs found to recapture.")
        setLoading(false)
        setProgress("")
        return
      }

      let completed = 0
      const total = jobs.length

      // 2. Loop through each job and recapture via Microlink (10s timeout)
      for (const job of jobs) {
        setProgress(`Recapturing (${completed + 1}/${total}): ${job.business_name}...`)

        try {
          const response = await fetch(
            `https://api.microlink.io/?url=${encodeURIComponent(job.website_url)}&screenshot=true&waitForTimeout=10000`
          )
          const json = await response.json()
          
          const newScreenshot = json?.data?.screenshot?.url || 
            `https://api.microlink.io/?url=${encodeURIComponent(job.website_url)}&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=10000`

          // Update Supabase for this specific job
          await supabase
            .from('jobs')
            .update({ screenshot_url: newScreenshot })
            .eq('id', job.id)

        } catch (err) {
          console.error(`Failed for ${job.business_name}:`, err)
        }

        completed++
      }

      setProgress("All screenshots updated successfully!")
      setTimeout(() => {
        setProgress("")
        router.refresh()
      }, 2000)

    } catch (err) {
      console.error("Bulk recapture error:", err)
      alert("An error occurred during bulk recapture.")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      {progress && (
        <span className="text-xs font-mono text-blue-400 animate-pulse flex items-center gap-1.5">
          <Zap className="w-3 h-3" /> {progress}
        </span>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRecaptureAll} 
        disabled={loading}
        className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
      >
        <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? "Recapturing All..." : "Recapture All Screenshots"}
      </Button>
    </div>
  )
}
