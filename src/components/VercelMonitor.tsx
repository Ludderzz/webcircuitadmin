"use client";
import React, { useState, useEffect } from 'react';

interface VercelProject {
  id: string;
  name: string;
  updatedAt: number;
  targets?: {
    production?: {
      id: string;
      alias: string[];
      readyState: string;
    };
  };
  alias?: string[];
  domainValid?: boolean;
}

export const VercelMonitor = ({ 
  vercelToken, 
  ntfyTopic, 
  ntfyToken 
}: { 
  vercelToken: string, 
  ntfyTopic: string, 
  ntfyToken: string 
}) => {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProjects = async () => {
    try {
      const teamId = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;
      const headers = { Authorization: `Bearer ${vercelToken}` };
      const teamParam = teamId ? `&teamId=${teamId}` : '';
      
      const res = await fetch(`https://api.vercel.com/v9/projects?limit=100${teamParam}`, { headers });
      const data = await res.json();
      
      if (!data.projects) return;

      const projectsWithHealth = await Promise.all((data.projects as VercelProject[]).map(async (p) => {
        const domain = p.targets?.production?.alias?.[0] || p.alias?.[0];
        if (!domain || domain.endsWith('.vercel.app')) return { ...p, domainValid: true };
        
        try {
          const dRes = await fetch(`https://api.vercel.com/v6/domains/${domain}/config${teamParam.replace('&', '?')}`, { headers });
          const dData = await dRes.json();
          return { ...p, domainValid: dData.configured && !dData.misconfigured };
        } catch {
          return { ...p, domainValid: false };
        }
      }));

      setProjects(projectsWithHealth);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Vercel Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // RESTORED: This is what the Ping button uses!
  const checkHealth = async (project: VercelProject) => {
    const state = project.targets?.production?.readyState || 'READY';
    const domain = project.targets?.production?.alias?.[0] || project.alias?.[0] || 'N/A';
    
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${ntfyToken}`,
          'Title': `Manual Ping: ${project.name}`,
          'Priority': state === 'ERROR' ? '5' : '3',
          'Tags': state === 'ERROR' ? 'rotating_light,skull' : 'rocket,white_check_mark'
        },
        body: `Node: ${project.name}\nStatus: ${state}\nDomain: ${domain}\nSSL Health: ${project.domainValid ? 'PASS' : 'FAIL'}`
      });
      alert(`Alert sent to ntfy topic: ${ntfyTopic}`);
    } catch (err) {
      alert("Failed to send ntfy notification.");
    }
  };

  const triggerRollback = async (project: VercelProject) => {
    const teamId = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;
    const teamParam = teamId ? `?teamId=${teamId}` : '';
    const headers = { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' };

    if (!confirm(`Are you sure you want to rollback ${project.name}?`)) return;

    try {
      const dRes = await fetch(`https://api.vercel.com/v6/deployments${teamParam}${teamParam ? '&' : '?'}projectId=${project.id}&limit=5`, { headers });
      const dData = await dRes.json();
      const prev = dData.deployments?.find((d: any, i: number) => i > 0 && d.state === 'READY');

      if (!prev) {
        alert("No suitable previous deployment found.");
        return;
      }

      const domain = project.targets?.production?.alias?.[0] || project.alias?.[0];
      await fetch(`https://api.vercel.com/v2/now/deployments/${prev.uid}/aliases${teamParam}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ alias: domain })
      });

      alert(`Rollback initiated!`);
      fetchProjects();
    } catch (err) {
      alert("Rollback failed.");
    }
  };

  useEffect(() => {
    if (vercelToken && mounted) {
      fetchProjects();
      const interval = setInterval(fetchProjects, 60000);
      return () => clearInterval(interval);
    }
  }, [vercelToken, mounted]);

  const currentItems = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const getStatusUI = (state: string | undefined) => {
    const status = state || 'READY'; 
    switch (status) {
      case 'READY': return <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded uppercase">Ready</span>;
      case 'ERROR': return <span className="text-[10px] text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded uppercase underline">Error</span>;
      default: return <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded animate-pulse uppercase">Building</span>;
    }
  };

  if (!mounted || loading) return <div className="p-4 text-slate-500 animate-pulse font-mono text-xs text-center">Syncing Dev-Ops...</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col min-h-[520px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 leading-tight">Vercel Status</h2>
          <p className="text-[10px] text-slate-500 italic mt-1 font-mono uppercase tracking-tighter">
            {projects.length} Nodes Online • {lastChecked}
          </p>
        </div>
        <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
      </div>

      <div className="space-y-3">
        {currentItems.map(p => (
          <div key={p.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
            <div className="flex items-start justify-between">
              <div className="overflow-hidden pr-2">
                <div className="flex items-center gap-2 mb-1">
                   <p className="font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{p.name}</p>
                   {getStatusUI(p.targets?.production?.readyState)}
                   <span title={p.domainValid ? "SSL Healthy" : "Domain Error"} className={`text-[10px] ${p.domainValid ? 'text-emerald-500' : 'text-red-500 animate-bounce'}`}>
                     🛡️
                   </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono truncate">
                  {p.targets?.production?.alias?.[0] || p.alias?.[0] || 'internal-only'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => triggerRollback(p)}
                  className="text-[9px] font-bold uppercase text-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-black px-2 py-2 rounded-lg transition-all active:scale-95"
                >
                  Revert
                </button>
                <button 
                  onClick={() => checkHealth(p)}
                  className="text-[9px] font-bold uppercase text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all active:scale-95"
                >
                  Ping
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(v => v - 1)} className="text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-20 uppercase tracking-widest">← Prev</button>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(v => v + 1)} className="text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-20 uppercase tracking-widest">Next →</button>
        </div>
      )}
    </div>
  );
};