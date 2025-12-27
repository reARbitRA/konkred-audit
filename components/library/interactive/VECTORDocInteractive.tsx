
import React, { useState } from 'react';
import { GitBranch, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

const VECTORDocInteractive: React.FC = () => {
  const [scores, setScores] = useState({ C: 0.8, X: 0.7, F: 0.9 });
  const [safety, setSafety] = useState(0.1);

  const q = Math.pow(scores.C * scores.X * scores.F, 1/3) * (1 - safety);
  const isViable = q > 0.6;

  return (
    <div className="space-y-8 font-mono animate-in zoom-in-95 duration-500">
      <div className="bg-black/40 border border-cyber-red/30 p-6 rounded-sm">
        <h3 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
          <GitBranch className="text-cyber-red" /> Stability Tester
        </h3>
        <p className="text-slate-400 text-xs">Simulate the Geometric Mean audit to test asset reliability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-cyber-dark/60 p-6 border border-cyber-gray rounded-sm">
           {['C', 'X', 'F'].map(k => (
             <div key={k}>
                <div className="flex justify-between text-[10px] text-slate-400 mb-2 uppercase">
                   <span>{k === 'C' ? 'Constraints' : k === 'X' ? 'Context' : 'Feasibility'} Score</span>
                   <span className="text-white font-bold">{(scores as any)[k].toFixed(2)}</span>
                </div>
                <input type="range" min="0.1" max="1" step="0.05" value={(scores as any)[k]} onChange={(e)=>setScores({...scores, [k]: Number(e.target.value)})} className="w-full accent-cyber-cyan h-1 bg-cyber-gray appearance-none cursor-pointer" />
             </div>
           ))}
           <div className="pt-4 border-t border-cyber-gray/30">
              <div className="flex justify-between text-[10px] text-cyber-red mb-2 uppercase font-bold">
                 <span>Safety Risk Factor</span>
                 <span>{(safety * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0" max="0.5" step="0.05" value={safety} onChange={(e)=>setSafety(Number(e.target.value))} className="w-full accent-cyber-red h-1 bg-cyber-gray appearance-none cursor-pointer" />
           </div>
        </div>

        <div className={`p-8 border rounded-sm flex flex-col items-center justify-center text-center transition-all duration-700 ${isViable ? 'border-cyber-green bg-cyber-green/5 shadow-neon-green' : 'border-cyber-red bg-cyber-red/5'}`}>
           <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="8" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke={isViable ? '#0aff00' : '#ff2a2a'} strokeWidth="8" strokeDasharray={`${q * 283} 283`} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <span className="text-4xl font-bold text-white">{(q * 100).toFixed(0)}%</span>
           </div>
           <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Reliability Coefficient (Q)</div>
           <div className={`text-xl font-bold flex items-center gap-2 ${isViable ? 'text-cyber-green' : 'text-cyber-red'}`}>
              {isViable ? <ShieldCheck size={20}/> : <AlertTriangle size={20}/>}
              {isViable ? 'VIABLE ASSET' : 'SCRAP ASSET'}
           </div>
        </div>
      </div>
    </div>
  );
};
export default VECTORDocInteractive;