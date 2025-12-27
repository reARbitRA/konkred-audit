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

const RadarChart: React.FC<{ variables: SCOREReport['variables'] }> = ({ variables }) => {
    const size = 200;
    const center = size / 2;
    const labels = ['S', 'H', 'D', 'E', 'Teff'];
    const values = [variables.S, variables.H, variables.D, 1 - variables.E, variables.Teff];
    const angleSlice = (Math.PI * 2) / labels.length;

    const points = values.map((value, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = center + value * center * 0.8 * Math.cos(angle);
        const y = center + value * center * 0.8 * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const axisPoints = labels.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = center + center * 0.9 * Math.cos(angle);
        const y = center + center * 0.9 * Math.sin(angle);
        return { x, y, label: labels[i] };
    });

    return (
        <div className="relative w-full max-w-[250px] mx-auto">
            <svg viewBox={`0 0 ${size} ${size}`}>
                {/* Background lines */}
                {[0.25, 0.5, 0.75, 1].map(r => (
                    <polygon
                        key={r}
                        points={labels.map((_, i) => {
                            const angle = angleSlice * i - Math.PI / 2;
                            const x = center + r * center * 0.8 * Math.cos(angle);
                            const y = center + r * center * 0.8 * Math.sin(angle);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="1"
                    />
                ))}
                {axisPoints.map((p, i) => (
                    <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                ))}

                {/* Data polygon */}
                <polygon points={points} fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="2" />
            </svg>
            {axisPoints.map((p, i) => (
                <div
                    key={i}
                    className="absolute text-[10px] font-bold text-slate-400"
                    style={{
                        left: `${(p.x / size) * 100}%`,
                        top: `${(p.y / size) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {p.label}
                </div>
            ))}
        </div>
    );
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
# KONKRED S.C.O.P.E. AUDIT REPORT
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
*Verified by Konkred S.C.O.P.E. Protocol*
    `.trim();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KONKRED_SCOPE_AUDIT_${watermark}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      
      {/* 3. S.C.O.P.E. Variables Breakdown with Radar Chart */}
      <div className="bg-cyber-dark/40 border border-cyber-gray p-6 md:p-8 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <div>
            <h3 className="text-[10px] text-cyber-cyan uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-bold">
                <Layers size={14} /> Prompt Engineering Shape
            </h3>
            <div className="space-y-4">
               {/* FIX: Explicitly cast key/value from entries to avoid indexed access and .toFixed unknown errors */}
               {(Object.entries(variables) as [keyof typeof SCOPE_DEFINITIONS, number][]).map(([key, value]) => (
                 <div key={key} className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold text-center w-8 h-8 flex items-center justify-center rounded-full bg-black border ${key === 'E' ? 'border-cyber-red/50 text-cyber-red' : 'border-cyber-cyan/50 text-cyber-cyan'}`}>
                        {key}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-400 uppercase tracking-wider">{SCOPE_DEFINITIONS[key].title}</span>
                            <span className="font-bold text-white">{value.toFixed(2)}</span>
                        </div>
                        <div className="h-1 bg-black/50 border border-cyber-gray/30 rounded-full overflow-hidden">
                           <div className={`h-full ${key === 'E' ? 'bg-cyber-red' : 'bg-cyber-cyan'}`} style={{width: `${value*100}%`}}></div>
                        </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="flex flex-col items-center justify-center">
            <RadarChart variables={variables} />
            <p className="text-center text-xs text-slate-500 mt-4 max-w-xs">
                The shape of the prompt's quality. A larger, more balanced shape indicates a well-engineered asset.
            </p>
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