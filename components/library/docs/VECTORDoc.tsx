
import React from 'react';
import { GitBranch, Activity, Lock, Search, AlertCircle } from 'lucide-react';

const VECTORDoc: React.FC = () => (
  <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-cyber-red/10 border border-cyber-red/50 rounded-sm">
          <GitBranch className="text-cyber-red" size={24} />
       </div>
       <div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-tighter m-0">V.E.C.T.O.R. System</h2>
          <div className="text-cyber-red text-[10px] tracking-[0.3em] font-bold">PROTOCOL v3.0 // VIABILITY LAYER</div>
       </div>
    </div>

    <section className="bg-black/40 border border-cyber-gray p-6 mb-8 rounded-sm">
       <h3 className="text-cyber-cyan text-xs uppercase mb-4 border-b border-cyber-gray pb-2">The Reliability Matrix</h3>
       <p className="text-slate-400 text-xs mb-6">
          V.E.C.T.O.R. is the final gateway audit. It determines if an asset is <span className="text-white">Production Ready</span> or <span className="text-cyber-red">Scrap Metal</span>.
       </p>
       <div className="space-y-4">
          <div className="flex gap-4 items-start">
             <div className="text-cyber-cyan font-bold text-xs">C</div>
             <div className="text-[11px] text-slate-500 font-bold uppercase">Constraints Alignment</div>
          </div>
          <div className="flex gap-4 items-start">
             <div className="text-cyber-cyan font-bold text-xs">X</div>
             <div className="text-[11px] text-slate-500 font-bold uppercase">Context Overlap</div>
          </div>
          <div className="flex gap-4 items-start">
             <div className="text-cyber-cyan font-bold text-xs">F</div>
             <div className="text-[11px] text-slate-500 font-bold uppercase">Feasibility Vector</div>
          </div>
       </div>
    </section>

    <h3 className="text-cyber-cyan text-xs uppercase mb-4">Geometric Stability Algorithm</h3>
    <div className="bg-black/60 p-8 border border-cyber-red/50 rounded-sm text-center mb-8 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-2 text-[8px] text-cyber-red opacity-50 uppercase font-bold tracking-widest">Actuarial Calculus</div>
       <div className="text-white text-xl mb-2">
          Q = <span className="text-cyber-cyan">∛(C × X × F)</span> × <span className="text-cyber-red">(1 - RiskFactor)</span>
       </div>
       <p className="text-[9px] text-slate-600 m-0 uppercase font-bold">The chain is only as strong as its weakest link.</p>
    </div>

    <div className="bg-cyber-red/10 border border-cyber-red/30 p-4 rounded-sm flex gap-4">
       <AlertCircle className="text-cyber-red shrink-0" size={18} />
       <p className="text-[11px] text-slate-500 m-0">
          <strong className="text-white font-bold">CRITICAL:</strong> If any quality dimension (C, X, or F) drops to 0, the total Reliability Coefficient (Q) becomes 0.0, identifying the asset as Scrap.
       </p>
    </div>
  </div>
);
export default VECTORDoc;