
import React, { useState } from 'react';
import { Tag, DollarSign, Repeat, TrendingUp, BarChart3 } from 'lucide-react';

const PRICEDocInteractive: React.FC = () => {
  const [savings, setSavings] = useState(8);
  const [volume, setVolume] = useState(500);

  const tav = savings * volume;
  const freelance = tav * 0.15;
  const market = tav * 0.02;

  const format = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-8 font-mono animate-in slide-in-from-right-4 duration-500">
      <div className="bg-black/40 border border-cyber-cyan/30 p-6 rounded-sm">
        <h3 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
          <Tag className="text-cyber-cyan" /> Valuation Simulator
        </h3>
        <p className="text-slate-400 text-xs">Treat your prompt as a financial asset. Calculate annual yield.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8 bg-cyber-dark/60 p-6 border border-cyber-gray rounded-sm">
          <div>
            <div className="flex justify-between text-[10px] uppercase text-cyber-green mb-3 font-bold">
               <span>Net Savings / Run</span>
               <span>${savings}</span>
            </div>
            <input type="range" min="1" max="50" value={savings} onChange={(e)=>setSavings(Number(e.target.value))} className="w-full accent-cyber-green h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] uppercase text-cyber-cyan mb-3 font-bold">
               <span>Yearly Volume (Runs)</span>
               <span>{volume.toLocaleString()}</span>
            </div>
            <input type="range" min="100" max="10000" step="100" value={volume} onChange={(e)=>setVolume(Number(e.target.value))} className="w-full accent-cyber-cyan h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
           <div className="bg-cyber-cyan/10 border border-cyber-cyan/30 p-6 rounded-sm text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Total Asset Value (Annual)</div>
              <div className="text-5xl font-bold text-white tracking-tighter">{format(tav)}</div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black border border-cyber-gray rounded-sm text-center">
                 <div className="text-[9px] text-slate-500 uppercase mb-1">Freelance Fee</div>
                 <div className="text-lg font-bold text-white">{format(freelance)}</div>
              </div>
              <div className="p-4 bg-black border border-cyber-gray rounded-sm text-center">
                 <div className="text-[9px] text-slate-500 uppercase mb-1">Marketplace License</div>
                 <div className="text-lg font-bold text-white">{format(market)}</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default PRICEDocInteractive;