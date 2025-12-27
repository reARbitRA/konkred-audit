
import React, { useState } from 'react';
import { Crosshair, Zap, Layers, Lock, ShieldAlert } from 'lucide-react';

const SCOPEDocInteractive: React.FC = () => {
  const [vals, setVals] = useState({ S: 0.6, H: 0.8, D: 0.5, E: 0.2 });

  const pvi = ((vals.S + vals.H + vals.D) / (Math.pow(1 + vals.E, 2))) * 2.5;

  const points = [
    { x: 50, y: 50 - (vals.S * 40) },
    { x: 50 + (vals.H * 40), y: 50 },
    { x: 50, y: 50 + (vals.D * 40) },
    { x: 50 - ((1 - vals.E) * 40), y: 50 }
  ];

  return (
    <div className="space-y-8 font-mono animate-in zoom-in-95 duration-500">
      <div className="bg-black/40 border border-yellow-500/30 p-6 rounded-sm">
        <h3 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
          <Crosshair className="text-yellow-500" /> Vector Tuner
        </h3>
        <p className="text-slate-400 text-xs">Analyze the information density and structural shape of your prompt.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5 bg-cyber-dark/60 p-6 border border-cyber-gray rounded-sm">
          {[
            { id: 'S', label: 'Structure (S)', icon: <Layers size={12}/> },
            { id: 'H', label: 'Hardness (H)', icon: <Lock size={12}/> },
            { id: 'D', label: 'Density (D)', icon: <Zap size={12}/> },
            { id: 'E', label: 'Entropy (E)', icon: <ShieldAlert size={12}/> },
          ].map(v => (
            <div key={v.id}>
              <div className="flex justify-between text-[10px] mb-2">
                <span className="text-slate-400 flex items-center gap-2">{v.icon} {v.label}</span>
                <span className="text-yellow-500 font-bold">{(vals as any)[v.id].toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={(vals as any)[v.id]} onChange={(e)=>setVals({...vals, [v.id]: Number(e.target.value)})} className="w-full accent-yellow-500 h-1 bg-cyber-gray appearance-none cursor-pointer" />
            </div>
          ))}
        </div>

        <div className="bg-black/40 border border-cyber-gray p-8 rounded-sm flex flex-col items-center relative overflow-hidden">
           <svg className="w-48 h-48 mb-6" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#222" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#222" strokeWidth="0.5" />
              <polygon 
                points={points.map(p => `${p.x},${p.y}`).join(' ')} 
                fill="rgba(234, 179, 8, 0.2)" 
                stroke="#eab308" 
                strokeWidth="2"
                className="transition-all duration-500"
              />
           </svg>
           <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Prompt Value Index</div>
              <div className="text-5xl font-bold text-yellow-500 tracking-tighter">{pvi.toFixed(3)}</div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default SCOPEDocInteractive;