
import React from 'react';
import { Tag, TrendingUp, DollarSign, Store, Briefcase } from 'lucide-react';

const PRICEDoc: React.FC = () => (
  <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-sm">
          <Tag className="text-cyber-cyan" size={24} />
       </div>
       <div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-tighter m-0">Asset Protocol [P.R.I.C.E.]</h2>
          <div className="text-cyber-cyan text-[10px] tracking-[0.3em] font-bold">PROTOCOL v5.2 // ASSET LAYER</div>
       </div>
    </div>

    <section className="bg-black/40 border border-cyber-gray p-6 mb-8 rounded-sm">
       <h3 className="text-cyber-cyan text-xs uppercase mb-4 border-b border-cyber-gray pb-2">Economic Multipliers</h3>
       <div className="space-y-6">
          <div className="flex gap-4">
             <TrendingUp className="text-cyber-green shrink-0" size={20}/>
             <div>
                <div className="text-white font-bold text-xs uppercase">Annualized Volumetric Value</div>
                <div className="text-[11px] text-slate-500">Calculates value based on the total net savings multiplied by yearly execution volume.</div>
             </div>
          </div>
          <div className="flex gap-4">
             <Briefcase className="text-cyber-cyan shrink-0" size={20}/>
             <div>
                <div className="text-white font-bold text-xs uppercase">Freelance Multiplier (15%)</div>
                <div className="text-[11px] text-slate-500">Suggested one-time development fee for enterprise deployment.</div>
             </div>
          </div>
          <div className="flex gap-4">
             <Store className="text-purple-500 shrink-0" size={20}/>
             <div>
                <div className="text-white font-bold text-xs uppercase">Marketplace Royalty (2%)</div>
                <div className="text-[11px] text-slate-500">Standard non-exclusive licensing fee for secondary marketplaces.</div>
             </div>
          </div>
       </div>
    </section>

    <h3 className="text-cyber-cyan text-xs uppercase mb-4">The Valuation Equation</h3>
    <div className="bg-black p-8 border border-dashed border-cyber-cyan rounded-sm text-center mb-8">
       <div className="text-white text-xl font-bold tracking-widest">
          TAV = <span className="text-cyber-green">(NetPerRun)</span> × <span className="text-cyber-cyan">(YearlyVolume)</span> × <span className="text-yellow-500">(Reliability)</span>
       </div>
    </div>

    <div className="bg-cyber-cyan/5 border border-cyber-cyan/30 p-4 rounded-sm italic text-[11px] text-slate-500 leading-relaxed">
       "Treat prompts as intellectual property. P.R.I.C.E. provides the actuarial math required to move prompts from 'experimentation' to 'balance sheet assets'."
    </div>
  </div>
);
export default PRICEDoc;