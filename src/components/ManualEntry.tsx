"use client"

import { useState } from 'react'
import { createClient } from '@/lib/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, PlusCircle } from "lucide-react"

export default function ManualEntry() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    let logoUrl = ""

    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, logoFile)

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from('logos').getPublicUrl(fileName)
        logoUrl = publicUrl.publicUrl
      }
    }

    const { error } = await supabase.from('jobs').insert({
      title: formData.get('business_name'),
      customer_name: formData.get('customer_name'),
      business_name: formData.get('business_name'),
      details: formData.get('details'),
      cost: Number(formData.get('cost')),
      is_recurring: formData.get('is_recurring') === 'on',
      logo_url: logoUrl,
      status: 'pending'
    })

    setLoading(false)
    if (error) alert(error.message)
    else window.location.reload()
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      autoComplete="off" // This kills the browser autocomplete for the whole form
      className="space-y-6 border border-slate-800 p-8 rounded-xl bg-slate-900/50 backdrop-blur-sm text-slate-50 shadow-xl"
    >
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <PlusCircle className="text-blue-500 w-5 h-5" />
        <h2 className="text-xl font-bold tracking-tight">New Project</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_name" className="text-slate-400 text-xs uppercase font-semibold">Customer Name</Label>
          <Input 
            id="customer_name" 
            name="customer_name" 
            placeholder="John Doe" 
            autoComplete="off" // Double insurance
            className="bg-slate-950 border-slate-800 focus:border-blue-500 transition-colors h-11" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_name" className="text-slate-400 text-xs uppercase font-semibold">Business Name</Label>
          <Input 
            id="business_name" 
            name="business_name" 
            placeholder="WebCircuit" 
            autoComplete="off" 
            className="bg-slate-950 border-slate-800 focus:border-blue-500 transition-colors h-11" 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-400 text-xs uppercase font-semibold">Business Logo</Label>
        <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-950/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-6 h-6 mb-2 text-slate-600 group-hover:text-blue-400 transition-colors" />
            <p className="text-xs text-slate-500 font-medium">
              {logoFile ? <span className="text-blue-400">{logoFile.name}</span> : "Drop logo here or click"}
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost" className="text-slate-400 text-xs uppercase font-semibold">Project Cost (£)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">£</span>
          <Input 
            id="cost" 
            name="cost" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            className="bg-slate-950 border-slate-800 pl-8 focus:border-blue-500 h-11 font-mono" 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details" className="text-slate-400 text-xs uppercase font-semibold">Design Brief</Label>
        <Textarea 
          id="details" 
          name="details" 
          placeholder="What are we building?" 
          className="bg-slate-950 border-slate-800 focus:border-blue-500 min-h-[100px] resize-none" 
        />
      </div>

      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="is_recurring" className="font-bold cursor-pointer">Monthly Recurring</Label>
          <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Adds to subscription revenue</span>
        </div>
        <Switch id="is_recurring" name="is_recurring" className="data-[state=checked]:bg-blue-600" />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]" disabled={loading}>
        {loading ? "Creating..." : "Launch Project"}
      </Button>
    </form>
  )
}