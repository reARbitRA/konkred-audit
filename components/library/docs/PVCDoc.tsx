
import React from 'react';
import { Cpu, Target, BookOpen, Scaling, ShieldCheck } from 'lucide-react';

const PVCDoc: React.FC = () => (
  <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/50 rounded-sm">
          <Cpu className="text-cyber-purple" size={24} />
       </div>
       <div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-tighter m-0">Prompt Value Calculator</h2>
          <div className="text-cyber-purple text-[10px] tracking-[0.3em] font-bold">PROTOCOL v3.1 // QUALITY LAYER</div>
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
       <section className="bg-black/40 border border-cyber-gray p-6 rounded-sm">
          <h3 className="text-cyber-cyan text-xs uppercase mb-4 border-b border-cyber-gray pb-2">Analysis Dimensions</h3>
          <ul className="list-none p-0 space-y-4">
             <li className="flex gap-3">
                <Target className="text-cyber-purple shrink-0" size={14}/>
                <div>
                   <div className="text-white font-bold text-xs uppercase">Goal Clarity (Gr)</div>
                   <div className="text-[10px] text-slate-500">Degree of unambiguous intent vs. interpretative drift.</div>
                </div>
             </li>
             <li className="flex gap-3">
                <BookOpen className="text-cyber-purple shrink-0" size={14}/>
                <div>
                   <div className="text-white font-bold text-xs uppercase">Context Sufficiency (Cr)</div>
                   <div className="text-[10px] text-slate-500">Environmental background vs. informational vacuum.</div>
                </div>
             </li>
             <li className="flex gap-3">
                <Scaling className="text-cyber-purple shrink-0" size={14}/>
                <div>
                   <div className="text-white font-bold text-xs uppercase">Structure (Dr)</div>
                   <div className="text-[10px] text-slate-500">Logical decomposition and use of semantic delimiters.</div>
                </div>
             </li>
          </ul>
       </section>

       <section className="bg-cyber-red/5 border border-cyber-red/30 p-6 rounded-sm">
          <h3 className="text-cyber-red text-xs uppercase mb-4 border-b border-cyber-red/20 pb-2">Penalty Modifiers</h3>
          <p className="text-[11px] text-slate-400">
             The P.V.C. protocol applies heavy penalties for <span className="text-white">Ambiguity</span> and <span className="text-white">Safety Risks</span>. 
             A technically perfect prompt with a potential jailbreak or vague format will score <span className="text-cyber-red">sub-40</span>.
          </p>
          <div className="mt-4 p-4 bg-black border border-cyber-gray font-bold text-center italic text-xs text-cyber-red">
             Final Score = (BaseQuality) * (1 - AmbiguityPenalty)
          </div>
       </section>
    </div>

    <div className="bg-cyber-purple/10 border border-cyber-purple/30 p-4 rounded-sm flex gap-4">
       <ShieldCheck className="text-cyber-purple shrink-0" size={18} />
       <p className="text-[11px] text-slate-500 m-0">
          <strong className="text-white">AUDIT RULE:</strong> Any prompt under 40 tokens automatically triggers a "Low Signal" length penalty, capping the score at 60.
       </p>
    </div>
  </div>
);
export default PVCDoc;