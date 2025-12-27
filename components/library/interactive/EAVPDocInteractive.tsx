
import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

const EAVPDocInteractive: React.FC = () => {
  const [manual, setManual] = useState(40);
  const [correction, setCorrection] = useState(10);

  const net = manual - correction;
  const efficiency = Math.max(0, Math.min(((manual - correction) / (manual || 1)) * 100, 100));

  return (
    <div className="space-y-8 font-mono animate-in fade-in duration-500">
      <div className="bg-black/40 border border-cyber-orange/30 p-6 rounded-sm">
        <h3 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
          <ShieldCheck className="text-cyber-orange" /> Verification Lab
        </h3>
        <p className="text-slate-400 text-xs">Verify the empirical time-savings of an automated asset.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8 bg-cyber-dark/60 p-6 border border-cyber-gray rounded-sm">
          <div>
            <div className="flex justify-between text-[10px] uppercase text-white mb-3">
               <span>Manual Labor Baseline</span>
               <span className="font-bold">{manual} Minutes</span>
            </div>
            <input type="range" min="10" max="120" value={manual} onChange={(e)=>setManual(Number(e.target.value))} className="w-full accent-white h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] uppercase text-cyber-red mb-3">
               <span>AI Correction Tax</span>
               <span className="font-bold">{correction} Minutes</span>
            </div>
            <input type="range" min="0" max="120" value={correction} onChange={(e)=>setCorrection(Number(e.target.value))} className="w-full accent-cyber-red h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="bg-black border border-cyber-gray p-8 rounded-sm text-center flex flex-col items-center justify-center">
           <div className="relative w-40 h-24 overflow-hidden mb-4">
              <div className="absolute bottom-0 w-40 h-40 border-[12px] border-cyber-gray rounded-full" />
              <div 
                className="absolute bottom-0 w-40 h-40 border-[12px] border-cyber-orange rounded-full transition-all duration-700 ease-out origin-center"
                style={{ clipPath: 'inset(0 0 50% 0)', transform: `rotate(${(efficiency/100) * 180 - 180}deg)` }}
              />
              <div className="absolute bottom-2 left-0 w-full text-3xl font-bold text-white">{efficiency.toFixed(0)}%</div>
           </div>
           <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Process Efficiency</div>
           <div className={`text-2xl font-bold ${net > 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
              {net > 0 ? `+${net}` : net} Minutes Saved
           </div>
        </div>
      </div>
    </div>
  );
};
export default EAVPDocInteractive;