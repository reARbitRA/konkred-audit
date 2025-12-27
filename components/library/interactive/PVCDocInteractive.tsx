
import React, { useState } from 'react';
import { Cpu, Target, Box, BookOpen, AlertCircle, ShieldAlert } from 'lucide-react';

const PVCDocInteractive: React.FC = () => {
  const [metrics, setMetrics] = useState({ G: 3, C: 2, S: 3, D: 2 });
  const [risk, setRisk] = useState(0);

  const baseScore = ((metrics.G + metrics.C + metrics.S + metrics.D) / 16) * 100;
  const finalScore = Math.max(0, baseScore * (1 - (risk * 0.25)));

  const getGrade = (s: number) => {
    if (s >= 95) return { l: 'S', c: 'text-cyber-orange border-cyber-orange' };
    if (s >= 85) return { l: 'A', c: 'text-cyber-green border-cyber-green' };
    if (s >= 70) return { l: 'B', c: 'text-cyber-cyan border-cyber-cyan' };
    if (s >= 50) return { l: 'C', c: 'text-yellow-500 border-yellow-500' };
    return { l: 'F', c: 'text-cyber-red border-cyber-red' };
  };

  const grade = getGrade(finalScore);

  return (
    <div className="space-y-8 font-mono animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-black/40 border border-cyber-purple/30 p-6 rounded-sm">
        <h3 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
          <Cpu className="text-cyber-purple" /> Quality Logic Lab
        </h3>
        <p className="text-slate-400 text-xs">Simulate the linguistic audit process used in P.V.C.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-cyber-dark/60 p-6 border border-cyber-gray rounded-sm">
          {[
            { id: 'G', label: 'Goal Clarity', icon: <Target size={12}/> },
            { id: 'C', label: 'Context', icon: <BookOpen size={12}/> },
            { id: 'S', label: 'Specificity', icon: <Box size={12}/> },
            { id: 'D', label: 'Decomposition', icon: <Cpu size={12}/> },
          ].map(m => (
            <div key={m.id}>
              <div className="flex justify-between text-[10px] mb-2">
                <span className="text-slate-400 flex items-center gap-2">{m.icon} {m.label}</span>
                <span className="text-cyber-purple font-bold">{(metrics as any)[m.id]}/4</span>
              </div>
              <input type="range" min="0" max="4" step="1" value={(metrics as any)[m.id]} onChange={(e)=>setMetrics({...metrics, [m.id]: Number(e.target.value)})} className="w-full accent-cyber-purple h-1 bg-cyber-gray appearance-none cursor-pointer" />
            </div>
          ))}
          <div className="pt-4 border-t border-cyber-gray/30">
            <div className="flex justify-between text-[10px] text-cyber-red mb-2 uppercase font-bold">
               <span>Compliance Risk Penalty</span>
               <span>Level {risk}</span>
            </div>
            <input type="range" min="0" max="4" step="1" value={risk} onChange={(e)=>setRisk(Number(e.target.value))} className="w-full accent-cyber-red h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-cyber-gray rounded-sm">
           <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-6">Real-time Asset Audit</div>
           <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 transition-all duration-500 ${grade.c} bg-black shadow-neon-cyan`}>
              <span className="text-6xl font-bold">{grade.l}</span>
           </div>
           <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{finalScore.toFixed(0)}</div>
              <div className="text-[10px] text-slate-500 uppercase">AAVM Index Score</div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default PVCDocInteractive;