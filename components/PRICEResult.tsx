
import React from 'react';
import { PRICEReport } from '../types';
import { FileText, Printer, ShieldCheck, DollarSign, Tag, Store, TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';

interface PRICEResultProps {
  report: PRICEReport;
}

const PRICEResult: React.FC<PRICEResultProps> = ({ report }) => {
  const { calculations, inputRequest, watermark, timestamp } = report;
  const { totalAssetValue, netRunSavings, humanCost, operationalCost, freelancePrice, marketplacePrice } = calculations;

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const isProfitable = netRunSavings > 0;

  const handleDownloadAsset = () => {
    const markdownContent = `
# ARBITRA P.R.I.C.E. AUDIT REPORT
**ID:** ${watermark}
**Date:** ${timestamp}
**Total Asset Value (TAV):** ${formatMoney(totalAssetValue)}
**Net Savings per Run:** ${formatMoney(netRunSavings)}

## FINANCIAL CALCULATION
- **Human Benchmark Cost:** ${formatMoney(humanCost)}
- **AI Operational Cost:** -${formatMoney(operationalCost)}
- **Reliability Factor:** ${(inputRequest.reliability * 100)}%

## PRICING TIERS
- **Suggested Freelance Price:** ${formatMoney(freelancePrice)}
- **Suggested Marketplace Price:** ${formatMoney(marketplacePrice)}

## INPUT DATA
- Human Time (min): ${inputRequest.humanTimeMinutes}
- Human Rate ($/hr): ${inputRequest.humanHourlyRate}
- Review Time (min): ${inputRequest.reviewTimeMinutes}
- Token Cost ($): ${inputRequest.tokenCost}
- Reliability: ${inputRequest.reliability}
- Yearly Volume: ${inputRequest.yearlyVolume}
- Use Case: ${inputRequest.useCase}

---
*Verified by Arbitra P.R.I.C.E. Protocol*
    `.trim();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARBITRA_PRICE_AUDIT_${watermark}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Header & Main Value */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-cyber-dark/40 backdrop-blur-sm border border-cyber-gray p-6 md:p-8 rounded-sm text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl text-white font-bold uppercase tracking-wider">Financial Valuation</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg">
            An accounting-based valuation to determine the total financial asset value of the prompt over its lifecycle.
          </p>
        </div>
        <div className={`lg:col-span-2 p-6 border ${isProfitable ? 'border-cyber-green' : 'border-cyber-red'} bg-cyber-dark rounded-sm flex flex-col justify-center text-center relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1.5 h-full ${isProfitable ? 'bg-cyber-green shadow-neon-green' : 'bg-cyber-red shadow-neon-red'}`}></div>
            <div className="relative">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Total Asset Value ({inputRequest.useCase})</div>
                <div className={`text-5xl font-bold tracking-tighter ${isProfitable ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
                    {formatMoney(totalAssetValue)}
                </div>
            </div>
        </div>
      </div>
      
      {/* 2. Calculation Waterfall */}
      <div className="bg-cyber-black/80 border border-cyber-gray relative overflow-hidden p-6 md:p-8 group rounded-sm">
          <div className="absolute inset-0 bg-noise opacity-5"></div>
          <h3 className="text-xs text-cyber-cyan uppercase tracking-[0.2em] mb-8 flex items-center gap-2 font-bold">
             <DollarSign size={14} /> P.R.I.C.E. Calculation Flow
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center group/item">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><TrendingUp size={12}/> Human Cost</div>
                <div className="text-2xl font-bold text-white font-mono">{formatMoney(humanCost)}</div>
             </div>
             <div className="text-2xl text-cyber-gray">-</div>
             <div className="text-center group/item">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><TrendingDown size={12}/> AI Cost</div>
                <div className="text-2xl font-bold text-white font-mono">{formatMoney(operationalCost)}</div>
             </div>
             <div className="text-2xl text-cyber-gray">=</div>
             <div className="text-center group/item p-4 border border-dashed border-cyber-gray/50 rounded-sm">
                <div className={`text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-1 font-bold ${isProfitable ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {isProfitable ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>} Net Savings / Run
                </div>
                <div className={`text-3xl font-bold font-mono ${isProfitable ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {formatMoney(netRunSavings)}
                </div>
             </div>
          </div>
      </div>

      {/* 3. Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm relative overflow-hidden group hover:border-cyber-cyan/50 transition-colors">
            <div className="absolute right-4 top-4 text-cyber-cyan/20 group-hover:text-cyber-cyan/50 transition-colors">
                <Tag size={32} />
            </div>
            <h3 className="text-sm text-cyber-cyan uppercase tracking-widest flex items-center gap-2 font-bold mb-3">
                Freelance Price
            </h3>
            <p className="text-3xl text-white font-bold tracking-tight">
                {formatMoney(freelancePrice)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
                Suggested fee for building this asset for a client (15% of TAV).
            </p>
          </div>
          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute right-4 top-4 text-purple-500/20 group-hover:text-purple-500/50 transition-colors">
                <Store size={32} />
            </div>
            <h3 className="text-sm text-purple-400 uppercase tracking-widest flex items-center gap-2 font-bold mb-3">
                Marketplace Price
            </h3>
            <p className="text-3xl text-white font-bold tracking-tight">
                {formatMoney(marketplacePrice)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
                Suggested one-time license fee for prompt marketplaces (2% of TAV).
            </p>
          </div>
      </div>

       {/* 4. AUDIT LOG & ACTIONS */}
       <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray p-6 font-mono text-xs leading-relaxed relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-gray"></div>
         <div className="flex justify-between items-start mb-6">
            <div className="bg-cyber-gray px-3 py-1 text-[10px] text-white tracking-widest uppercase flex items-center gap-2 font-bold">
               <ShieldCheck size={10} /> P.R.I.C.E. Audit Log
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

export default PRICEResult;
