
import React from 'react';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const EAVPDoc: React.FC = () => (
  <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-cyber-orange/10 border border-cyber-orange/50 rounded-sm">
          <ShieldCheck className="text-cyber-orange" size={24} />
       </div>
       <div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-tighter m-0">Empirical Verification</h2>
          <div className="text-cyber-orange text-[10px] tracking-[0.3em] font-bold">PROTOCOL v4.0 // VERIFICATION LAYER</div>
       </div>
    </div>

    <section className="bg-black/40 border border-cyber-gray p-6 mb-8 rounded-sm">
       <h3 className="text-cyber-cyan text-xs uppercase mb-4 border-b border-cyber-gray pb-2">The Verification Cycle</h3>
       <div className="space-y-4">
          <div className="flex gap-4 p-3 bg-cyber-dark/50 border border-cyber-gray hover:border-cyber-orange transition-colors">
             <div className="w-8 h-8 rounded-full bg-cyber-orange/20 text-cyber-orange flex items-center justify-center font-bold">1</div>
             <div>
                <div className="text-white font-bold text-xs uppercase">Baseline Physics</div>
                <div className="text-[10px] text-slate-500">Calculate the exact time required for an SME to perform the task manually.</div>
             </div>
          </div>
          <div className="flex gap-4 p-3 bg-cyber-dark/50 border border-cyber-gray hover:border-cyber-orange transition-colors">
             <div className="w-8 h-8 rounded-full bg-cyber-orange/20 text-cyber-orange flex items-center justify-center font-bold">2</div>
             <div>
                <div className="text-white font-bold text-xs uppercase">Correction Tax Audit</div>
                <div className="text-[10px] text-slate-500">Factor in regenerations, token latency, and human editing time.</div>
             </div>
          </div>
          <div className="flex gap-4 p-3 bg-cyber-dark/50 border border-cyber-gray hover:border-cyber-orange transition-colors">
             <div className="w-8 h-8 rounded-full bg-cyber-orange/20 text-cyber-orange flex items-center justify-center font-bold">3</div>
             <div>
                <div className="text-white font-bold text-xs uppercase">Efficiency Quotient</div>
                <div className="text-[10px] text-slate-500">Determine if the automated route provides a >40% net gain in time.</div>
             </div>
          </div>
       </div>
    </section>

    <div className="bg-cyber-orange/10 border border-cyber-orange/30 p-4 rounded-sm">
       <div className="flex items-center gap-2 mb-2 text-cyber-orange font-bold uppercase text-xs">
          <AlertTriangle size={14}/> Liability Warning
       </div>
       <p className="text-[10px] text-slate-500 m-0">
          Any prompt yielding an efficiency quotient below 0.0 is classified as a <span className="text-cyber-red">Liability Asset</span>. 
          Deployment will result in operational drag and negative ROI.
       </p>
    </div>
  </div>
);
export default EAVPDoc;