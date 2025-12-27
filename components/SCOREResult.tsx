
import React from 'react';
import { SCOREReport } from '../types';
import { 
  Target, FileText, Printer, ShieldCheck, HelpCircle,
  FileCode2, Lock, BookText, Shuffle, Feather, BarChart, AlertTriangle, CheckCircle2, Layers
} from 'lucide-react';
import AccoladesDisplay from './AccoladesDisplay';

interface SCOREResultProps {
  report: SCOREReport;
}

const SCOPE_DEFINITIONS: Record<string, { title: string; description: string; }> = {
  S: { title: "Structure", description: "The logical architecture and separation of components in the prompt." },
  H: { title: "Constraint Hardness", description: "How well the prompt uses specific, hard constraints to eliminate incorrect answers." },
  D: { title: "Contextual Density", description: "The quality and relevance of background information and examples provided." },
  E: { title: "Ambiguity Entropy", description: "The degree of potential misinterpretation. Lower is better." },
  Teff: { title: "Token Efficiency", description: "The ratio of essential, high-signal words to the total token count." }
};

const SCOREResult: React.FC<SCOREResultProps> = ({ report }) => {
  const { calculations, variables, watermark, timestamp, inputPrompt, accolades } = report;
  const { pvi } = calculations;

  const getValuationTier = (score: number) => {
    if (score > 2.0) return { tier: "High-Value Asset", color: "text-cyber-green", icon: <CheckCircle2 size={16} /> };
    if (score > 0.5) return { tier: "Market Standard", color: "text-yellow-400", icon: <BarChart size={16} /> };
    return { tier: "Scrap Value", color: "text-cyber-red", icon: <AlertTriangle size={16} /> };
  };

  const valuation = getValuationTier(pvi);

  const handleDownloadAsset = () => {
    const markdownContent = `
# ARBITRA S.C.O.P.E. AUDIT REPORT
**ID:** ${watermark}
**Date:** ${timestamp}
**Prompt Value Index ($PVI$):** ${pvi.toFixed(3)}
**Valuation Tier:** ${valuation.tier}

## S.C.O.P.E. VARIABLES (0-1)
- Structure (S): ${variables.S.toFixed(2)}
- Constraint Hardness (H): ${variables.H.toFixed(2)}
- Contextual Density (D): ${variables.D.toFixed(2)}
- Ambiguity Entropy (E): ${variables.E.toFixed(2)}
- Token Efficiency (Teff): ${variables.Teff.toFixed(2)}

## PROMPT DATA
\`\`\`text
${inputPrompt}
\`\`\`
---
*Verified by Arbitra S.C.O.P.E. Protocol*
    `.trim();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARBITRA_SCOPE_AUDIT_${watermark}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const MetricItem: React.FC<{ icon: React.ReactNode, metricKey: keyof typeof SCOPE_DEFINITIONS, value: number, isPenalty?: boolean }> = ({ icon, metricKey, value, isPenalty = false }) => (
    <div className="flex items-center gap-4 group p-2 -m-2 rounded-sm hover:bg-white/5 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-sm bg-cyber-dark/50 border border-cyber-gray ${isPenalty ? 'text-cyber-red' : 'text-cyber-cyan'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider mb-1">
          <span className="text-slate-400 flex items-center gap-1.5 cursor-help" title={SCOPE_DEFINITIONS[metricKey].description}>
            {SCOPE_DEFINITIONS[metricKey].title}
            <HelpCircle size={10} className="opacity-50" />
          </span>
          <span className={`font-bold text-sm ${isPenalty ? 'text-cyber-red' : 'text-white'}`}>
            {value.toFixed(2)}
          </span>
        </div>
        <div className="h-2 bg-black border border-cyber-gray/50 relative overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[scan_2s_linear_infinite]"></div>
            <div className={`${isPenalty ? 'bg-cyber-red' : 'bg-cyber-cyan'} h-full transition-all duration-700 shadow-[0_0_8px_currentColor]`} style={{ width: `${value * 100}%` }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Main Score Display & Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cyber-dark/40 backdrop-blur-sm border border-cyber-gray p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 rounded-sm text-center md:text-left">
            <div className="relative w-40 h-40">
                <div className="absolute inset-0 border-2 border-dashed border-cyber-gray/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 border border-cyber-gray rounded-full"></div>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className={`text-6xl font-bold tracking-tighter ${valuation.color}`}>
                        {pvi.toFixed(3)}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Prompt Value Index</span>
                </div>
            </div>
            <div className="flex-1">
                <h2 className="text-3xl text-white font-bold uppercase tracking-wider">S.C.O.P.E. Analysis</h2>
                <p className="text-slate-400 text-sm mt-2 max-w-lg">
                An algorithmic valuation based on Information Theory, treating the prompt as a structured semantic investment.
                </p>
            </div>
        </div>
        <div className={`bg-cyber-dark/40 border border-cyber-gray p-6 flex flex-col items-center justify-center rounded-sm text-center group hover:-translate-y-1 transition-transform duration-300 ${valuation.tier === 'High-Value Asset' ? 'hover:border-cyber-green' : valuation.tier === 'Market Standard' ? 'hover:border-yellow-400' : 'hover:border-cyber-red'}`}>
            <div className={`mb-4 ${valuation.color} transition-colors`}>
                {React.cloneElement(valuation.icon, { className: "w-12 h-12 drop-shadow-lg group-hover:scale-110 transition-transform" })}
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{valuation.tier}</h3>
            <p className="text-xs text-slate-500 mt-1">
                {valuation.tier === 'High-Value Asset' && 'Reliable enough for automated, production pipelines.'}
                {valuation.tier === 'Market Standard' && 'Functional for simple tasks, may require follow-up.'}
                {valuation.tier === 'Scrap Value' && 'High risk of hallucination and requires significant rework.'}
            </p>
        </div>
      </div>
      
      {/* 2. Accolades Display */}
      <AccoladesDisplay accolades={accolades} />
      
      {/* 3. S.C.O.P.E. Variables Breakdown */}
      <div className="bg-cyber-dark/40 border border-cyber-gray p-6 md:p-8 rounded-sm">
         <h3 className="text-[10px] text-cyber-cyan uppercase tracking-[0.2em] mb-8 flex items-center gap-2 font-bold">
            <Layers size={14} /> S.C.O.P.E. Vector Analysis
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <MetricItem icon={<FileCode2 size={16}/>} metricKey="S" value={variables.S} />
            <MetricItem icon={<Lock size={16}/>} metricKey="H" value={variables.H} />
            <MetricItem icon={<BookText size={16}/>} metricKey="D" value={variables.D} />
            <MetricItem icon={<Shuffle size={16}/>} metricKey="E" value={1 - variables.E} isPenalty />
            <MetricItem icon={<Feather size={16}/>} metricKey="Teff" value={variables.Teff} />
         </div>
      </div>
      
       {/* 4. AUDIT LOG & ACTIONS */}
       <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray p-6 font-mono text-xs leading-relaxed relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-gray"></div>
         <div className="flex justify-between items-start mb-6">
            <div className="bg-cyber-gray px-3 py-1 text-[10px] text-white tracking-widest uppercase flex items-center gap-2 font-bold">
               <Layers size={10} /> S.C.O.P.E. Audit Log
            </div>
            
            <div className="flex gap-3 print:hidden">
              <button 
                onClick={handleDownloadAsset}
                className="flex items-center gap-2 text-[10px] bg-cyber-dark border border-cyber-gray hover:border-cyber-cyan text-slate-400 hover:text-white px-3 py-1 transition-all uppercase tracking-wider"
              >
                 <FileText size={12} /> Save Audit (.md)
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-[10px] bg-cyber-dark border border-cyber-gray hover:border-cyber-red text-slate-400 hover:text-white px-3 py-1 transition-all uppercase tracking-wider"
              >
                 <Printer size={12} /> Export Dossier
              </button>
            </div>
         </div>
         
         <div className="mt-8 pt-6 border-t border-cyber-gray flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-600">
                  <ShieldCheck size={10} />
                  <span>AUDIT_ID: <span className="text-slate-400">{watermark}</span></span>
                </div>
                <div className="text-[10px] font-mono text-slate-600">
                  TIMESTAMP: <span className="text-slate-400">{timestamp}</span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SCOREResult;
