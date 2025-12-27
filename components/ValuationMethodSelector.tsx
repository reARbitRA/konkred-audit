
import React from 'react';
import { ValuationMethod } from '../types';
import { Cpu, DollarSign, Crosshair, ShieldCheck, Tag, GitBranch, Zap, Layers } from 'lucide-react';

interface ValuationMethodSelectorProps {
  selectedMethod: ValuationMethod;
  setMethod: (method: ValuationMethod) => void;
}

const ValuationMethodSelector: React.FC<ValuationMethodSelectorProps> = ({ selectedMethod, setMethod }) => {
  const options: { id: ValuationMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'DLA', label: 'D.L.A.', icon: <DollarSign size={14} /> },
    { id: 'PVC', label: 'P.V.C.', icon: <Cpu size={14} /> },
    { id: 'SCOPE', label: 'S.C.O.P.E.', icon: <Crosshair size={14} /> },
    { id: 'EAVP', label: 'E.A.V.P.', icon: <ShieldCheck size={14} /> },
    { id: 'PRICE', label: 'P.R.I.C.E.', icon: <Tag size={14} /> },
    { id: 'VECTOR', label: 'V.E.C.T.O.R.', icon: <GitBranch size={14} /> },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-center gap-4">
       <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 text-center xl:text-left">
          Analysis Method
       </div>
       <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
         <div className="bg-cyber-black/80 border border-cyber-gray p-1 rounded-sm flex flex-wrap items-center justify-center space-x-1 backdrop-blur-sm">
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => setMethod(option.id as ValuationMethod)}
                className={`relative px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-300 ease-in-out flex items-center gap-2
                  ${selectedMethod === option.id 
                    ? 'text-cyber-cyan' 
                    : 'text-slate-500 hover:text-white'
                  }`
                }
              >
                {selectedMethod === option.id && (
                  <span className="absolute inset-0 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-sm animate-in fade-in duration-500"></span>
                )}
                <span className="relative z-10">{option.icon}</span>
                <span className="relative z-10 hidden md:inline">{option.label}</span>
              </button>
            ))}
         </div>
         <div className="w-px h-8 bg-cyber-gray hidden sm:block mx-2"></div>
         <div className="flex gap-2 w-full sm:w-auto">
            <button
                onClick={() => setMethod('CORE')}
                className={`relative w-full sm:w-auto flex-1 sm:flex-initial px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-300 ease-in-out flex items-center justify-center gap-2 border
                ${selectedMethod === 'CORE'
                    ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple shadow-neon-purple'
                    : 'bg-cyber-purple/10 border-cyber-purple/50 text-slate-300 hover:bg-cyber-purple/20 hover:text-white'
                }`
                }
            >
                <Layers size={14} />
                Core
            </button>
            <button
                onClick={() => setMethod('ALL')}
                className={`relative w-full sm:w-auto flex-1 sm:flex-initial px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-300 ease-in-out flex items-center justify-center gap-2 border
                ${selectedMethod === 'ALL'
                    ? 'bg-cyber-red/20 border-cyber-red text-cyber-red shadow-neon-red animate-pulse'
                    : 'bg-cyber-red/10 border-cyber-red/50 text-slate-300 hover:bg-cyber-red/20 hover:text-white'
                }`
                }
            >
                <Zap size={14} />
                All
            </button>
         </div>
       </div>
    </div>
  );
};

export default ValuationMethodSelector;
