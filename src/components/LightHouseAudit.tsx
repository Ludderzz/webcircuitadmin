"use client";
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // FIX: Direct import for autoTable
import { Search, Download, Gauge, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function LighthouseAudit() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runAudit = async () => {
    if (!url) return alert("Please enter a URL first");
    setLoading(true);
    try {
      const res = await fetch('/api/webcircuit/lighthouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      alert(err.message || "Audit failed. Check your API key and URL.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("WEBCIRCUIT INTELLIGENCE", 20, 25);
    
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setFontSize(10);
    doc.text(`REPORT FOR: ${result.url.toUpperCase()}`, 20, 33);

    // FIX: Using autoTable(doc, ...) instead of doc.autoTable(...)
    autoTable(doc, {
      startY: 50,
      head: [['METRIC', 'SCORE / RESULT']],
      body: [
        ['Performance Score', `${result.scores.performance}%`],
        ['SEO Health', `${result.scores.seo}%`],
        ['Accessibility', `${result.scores.accessibility}%`],
        ['Largest Contentful Paint (LCP)', result.vitals.lcp],
        ['Cumulative Layout Shift (CLS)', result.vitals.cls],
        ['First Contentful Paint (FCP)', result.vitals.fcp],
      ],
      styles: { fontSize: 11, cellPadding: 6, font: 'helvetica' },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 }
    });

    doc.save(`WebCircuit_Report_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="relative group">
      {/* GLOW EFFECT */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      
      <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Target URL for Audit
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="https://example.com" 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={runAudit}
            disabled={loading}
            className="w-full md:w-auto h-[50px] px-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Zap className="w-4 h-4" /> Run Intelligence Audit</>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                  <Gauge className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Performance</p>
                  <p className="text-2xl font-black text-slate-100">{result.scores.performance}%</p>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">SEO Health</p>
                  <p className="text-2xl font-black text-slate-100">{result.scores.seo}%</p>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Globe className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Accessibility</p>
                  <p className="text-2xl font-black text-slate-100">{result.scores.accessibility}%</p>
                </div>
              </div>
            </div>

            <button 
              onClick={downloadPDF}
              className="w-full group/btn bg-slate-100 hover:bg-white text-slate-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              <Download className="w-5 h-5 group-hover/btn:bounce" />
              Download White-Label Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}