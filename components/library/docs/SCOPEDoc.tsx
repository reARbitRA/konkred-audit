
import React from 'react';
import { Crosshair, Layers, Lock, ShieldAlert, BarChart3 } from 'lucide-react';

const SCOPEDoc: React.FC = () => (
  <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-sm">
          <Crosshair className="text-yellow-500" size={24} />
       </div>
       <div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-tighter m-0">S.C.O.P.E. Standard</h2>
          <div className="text-yellow-500 text-[10px] tracking-[0.3em] font-bold">PROTOCOL v1.8 // SEMANTIC LAYER</div>
       </div>
    </div>

    <section className="bg-black/40 border border-cyber-gray p-6 mb-8 rounded-sm">
       <h3 className="text-cyber-cyan text-xs uppercase mb-4 border-b border-cyber-gray pb-2">Vector Definitions</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex gap-2">
             <span className="text-yellow-500 font-bold">[S]</span>
             <span className="text-xs text-slate-400 font-bold uppercase">Structure:</span>
             <span className="text-xs text-slate-500">Logical architecture and separation of concerns.</span>
          </div>
          <div className="flex gap-2">
             <span className="text-yellow-500 font-bold">[H]</span>
             <span className="text-xs text-slate-400 font-bold uppercase">Hardness:</span>
             <span className="text-xs text-slate-500">Presence of negative constraints and exact schemas.</span>
          </div>
          <div className="flex gap-2">
             <span className="text-yellow-500 font-bold">[D]</span>
             <span className="text-xs text-slate-400 font-bold uppercase">Density:</span>
             <span className="text-xs text-slate-500">Information-to-token ratio (Signal vs. Noise).</span>
          </div>
          <div className="flex gap-2">
             <span className="text-cyber-red font-bold">[E]</span>
             <span className="text-xs text-slate-400 font-bold uppercase">Entropy:</span>
             <span className="text-xs text-slate-500">Uncertainty and interpretative hallucination risk.</span>
          </div>
       </div>
    </section>

    <h3 className="text-cyber-cyan text-xs uppercase mb-4">Technical Formula</h3>
    <div className="bg-black p-8 border border-cyber-gray font-bold text-center mb-8 relative">
       <div className="absolute top-2 left-2 text-[8px] text-slate-700 uppercase">Information Theory Matrix</div>
       <div className="text-white text-xl">
          PVI = <span className="text-yellow-500">(S + H + D)</span> / <span className="text-cyber-red">(1 + E)²</span>
       </div>
    </div>

    <p className="text-[11px] text-slate-500 leading-relaxed italic">
       "A prompt is a semantic investment. S.C.O.P.E. verifies the density of that investment to ensure the machine 
       doesn't spend tokens on irrelevant output branches."
    </p>
  </div>
);
export default SCOPEDoc;