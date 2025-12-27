
import React, { useState } from 'react';
import { DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Scale } from 'lucide-react';

const DLADocInteractive: React.FC = () => {
  const [hourlyWage, setHourlyWage] = useState(60);
  const [humanTime, setHumanTime] = useState(45); 
  const [aiFriction, setAiFriction] = useState(5); 

  const humanCost = (humanTime / 60) * hourlyWage;
  const aiCost = (aiFriction / 60) * hourlyWage + 0.02; // Base API cost
  const netValue = humanCost - aiCost;
  const isProfitable = netValue > 0;
  
  const balance = Math.min(Math.max((netValue / (humanCost || 1)) * 50 + 50, 10), 90);

  return (
    <div className="space-y-8 font-mono animate-in fade-in duration-500">
      <div className="bg-black/40 border border-cyber-green/30 p-6 rounded-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-green/5 blur-3xl" />
        <h3 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
          <DollarSign className="text-cyber-green" /> Arbitrage Simulator
        </h3>
        <p className="text-slate-400 text-xs">Simulate the financial delta between manual labor and AI friction.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-cyber-dark/60 p-6 border border-cyber-gray rounded-sm">
          <div>
             <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2">
                <span className="text-slate-500">Operator Hourly Rate</span>
                <span className="text-cyber-green font-bold">${hourlyWage}/hr</span>
             </div>
             <input type="range" min="20" max="250" value={hourlyWage} onChange={(e)=>setHourlyWage(Number(e.target.value))} className="w-full accent-cyber-green h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
          <div>
             <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2">
                <span className="text-slate-500">Manual Task Duration</span>
                <span className="text-white font-bold">{humanTime} min</span>
             </div>
             <input type="range" min="5" max="120" value={humanTime} onChange={(e)=>setHumanTime(Number(e.target.value))} className="w-full accent-white h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
          <div>
             <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2">
                <span className="text-cyber-red">AI Operational Friction</span>
                <span className="text-cyber-red font-bold">{aiFriction} min</span>
             </div>
             <input type="range" min="0" max="60" value={aiFriction} onChange={(e)=>setAiFriction(Number(e.target.value))} className="w-full accent-cyber-red h-1 bg-cyber-gray appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <div className={`p-8 border-2 rounded-sm text-center relative overflow-hidden transition-all duration-700 ${isProfitable ? 'border-cyber-green bg-cyber-green/5' : 'border-cyber-red bg-cyber-red/5'}`}>
             <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">Arbitrage Balance</div>
             <div className="relative h-12 flex items-center justify-center mb-6">
                <div className="absolute w-full h-0.5 bg-cyber-gray" />
                <div className="absolute w-1 h-6 bg-white z-10" />
                <div className="absolute transition-all duration-700 ease-out" style={{ left: `${balance}%` }}>
                   <Scale size={32} className={isProfitable ? 'text-cyber-green' : 'text-cyber-red'} />
                </div>
             </div>
             <div className={`text-5xl font-bold tracking-tighter ${isProfitable ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
                ${Math.abs(netValue).toFixed(2)}
             </div>
             <p className="text-[10px] text-slate-500 uppercase mt-2">{isProfitable ? 'Net Profit / Run' : 'Net Loss / Run'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DLADocInteractive;