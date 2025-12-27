
import React from 'react';
import { DollarSign, Cpu, Clock, Activity, FileText } from 'lucide-react';

const DLADoc: React.FC = () => (
  <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-cyber-green/10 border border-cyber-green/50 rounded-sm">
          <DollarSign className="text-cyber-green" size={24} />
       </div>
       <div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-tighter m-0">Differential Labor Arbitrage</h2>
          <div className="text-cyber-green text-[10px] tracking-[0.3em] font-bold">PROTOCOL v2.4 // FINANCIAL LAYER</div>
       </div>
    </div>

    <section className="bg-black/40 border border-cyber-gray p-6 mb-8 rounded-sm">
       <h3 className="text-cyber-cyan text-xs uppercase mb-4 border-b border-cyber-gray pb-2">1. Overview</h3>
       <p className="text-slate-400">
          The D.L.A. protocol measures the fiscal efficiency of an AI agent by calculating the net delta between 
          <span className="text-white font-bold"> Manual Production Physics</span> and 
          <span className="text-cyber-red font-bold"> Hidden Friction Costs</span>. 
          It is the primary deterministic method for verifying ROI in automated workflows.
       </p>
    </section>

    <section className="mb-8">
       <h3 className="text-cyber-cyan text-xs uppercase mb-4">2. The Core Algorithm</h3>
       <div className="bg-black p-6 border border-dashed border-cyber-gray rounded-sm font-bold text-center italic">
          <span className="text-white">NetValue</span> = (GrossLaborValue) - (WaitCost + ReadingCost + FixingCost + APICost)
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-cyber-dark/40 p-4 border border-cyber-gray">
             <div className="text-cyber-green text-[10px] font-bold uppercase mb-2">Positive Variables</div>
             <ul className="list-none p-0 text-xs text-slate-400 space-y-1">
                <li>• Displacement of expensive human hours.</li>
                <li>• Accelerated throughput cycles.</li>
             </ul>
          </div>
          <div className="bg-cyber-dark/40 p-4 border border-cyber-gray">
             <div className="text-cyber-red text-[10px] font-bold uppercase mb-2">Negative Friction (The Tax)</div>
             <ul className="list-none p-0 text-xs text-slate-400 space-y-1">
                <li>• Human latency during token generation.</li>
                <li>• Cognitive load of verification.</li>
                <li>• Iterative correction sessions.</li>
             </ul>
          </div>
       </div>
    </section>

    <div className="bg-cyber-green/5 border border-cyber-green/30 p-4 rounded-sm flex gap-4">
       <Activity className="text-cyber-green shrink-0" size={18} />
       <p className="text-[11px] text-slate-500 m-0">
          <strong className="text-white">PRO TIP:</strong> High-latency models often yield negative D.L.A. if the operator's hourly rate is high. 
          Use Flash-tier models to maximize arbitrage.
       </p>
    </div>
  </div>
);
export default DLADoc;