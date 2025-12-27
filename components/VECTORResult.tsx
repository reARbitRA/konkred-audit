
import React from 'react';
import { VECTORReport } from '../types';
import { FileText, Printer, ShieldCheck, DollarSign, GitBranch, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Info } from 'lucide-react';

interface VECTORResultProps {
  report: VECTORReport;
}

const VECTORResult: React.FC<VECTORResultProps> = ({ report }) => {
  const { calculations, status, reason, watermark, timestamp, inputRequest } = report;
  const { Q, net_utility, total_annual_value, freelance_price, marketplace_price, correction_cost, gross_total_value } = calculations;

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

  const isViable = status === "VIABLE ASSET";

  const getQColor = (q: number) => {
    if (q > 0.8) return 'text-cyber-green';
    if (q > 0.5) return 'text-yellow-400';
    return 'text-cyber-red';
  };

  const radius = 60;
  const stroke = 7;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Q * circumference);

  const handleDownloadAsset = () => {
    const markdownContent = `
# ARBITRA V.E.C.T.O.R. AUDIT REPORT
**ID:** ${watermark}
**Date:** ${timestamp}
**Status:** ${status}
**Reliability Coefficient (Q):** ${formatPercent(Q)}

## VALUATION
- **True Asset Value (Internal):** ${formatMoney(total_annual_value)}
- **Suggested Freelance Price:** ${formatMoney(freelance_price)}
- **Suggested Marketplace Price:** ${formatMoney(marketplace_price)}

## CALCULATION
- **Net Utility per Run:** ${formatMoney(net_utility)}
- **Gross Value per Run:** ${formatMoney(gross_total_value)}
- **Correction Tax per Run:** -${formatMoney(correction_cost)}

## INPUT DATA
- **Scores (C,D,F,S):** ${inputRequest.score_constraints}, ${inputRequest.score_context}, ${inputRequest.score_feasibility}, ${inputRequest.score_safety}
- **Human Rate:** ${formatMoney(inputRequest.human_hourly_rate)}/hr
- **Time Saved:** ${inputRequest.time_saved_minutes} min/run
- **Annual Volume:** ${inputRequest.annual_volume} runs
- **API Cost:** ${formatMoney(inputRequest.api_cost_per_run)}/run
---
*Verified by Arbitra V.E.C.T.O.R. Protocol*
    `.trim();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARBITRA_VECTOR_AUDIT_${watermark}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Header & Status */}
      <div className={`p-6 md:p-8 border ${isViable ? 'border-cyber-green' : 'border-cyber-red'} bg-cyber-dark rounded-sm flex flex-col items-center text-center relative overflow-hidden group`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full ${isViable ? 'bg-cyber-green shadow-neon-green' : 'bg-cyber-red shadow-neon-red'}`}></div>
          <div className={`absolute inset-0 ${isViable ? 'bg-cyber-green/5' : 'bg-cyber-red/5'} opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-fast`}></div>
          <div className="relative z-10">
              <div className={`mb-4 ${isViable ? 'text-cyber-green' : 'text-cyber-red'}`}>
                  {isViable ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
              </div>
              <h2 className={`text-3xl font-bold uppercase tracking-wider ${isViable ? 'text-white' : 'text-cyber-red text-glow-red'}`}>{status}</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                  {isViable ? "The prompt's technical quality is sufficient to generate positive financial value." : reason}
              </p>
          </div>
      </div>

      {/* 2. Main Display: Q Score + Valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Q Score */}
        <div className="bg-cyber-dark/40 backdrop-blur-sm border border-cyber-gray p-6 flex flex-col items-center justify-center rounded-sm">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            Reliability Coefficient (Q)
            <div className="relative group/info">
                <Info size={12} className="cursor-help text-slate-600" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-black border border-cyber-cyan text-cyber-cyan text-[10px] p-3 rounded shadow-neon-cyan opacity-0 group-hover/info:opacity-100 transition-all pointer-events-none z-20 text-left">
                    <p className="font-bold mb-1 uppercase tracking-wider">Q-Score Calculation:</p>
                    Calculated as the geometric mean of Constraints, Context, and Feasibility scores, then multiplied by a safety factor. This heavily penalizes prompts weak in any single quality dimension.
                </div>
            </div>
          </h3>
          <div className="relative">
            <svg height="140" width="140" className="transform -rotate-90">
              <circle stroke="#1a1a1a" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
              <circle
                stroke={getQColor(Q).replace('text-', '')}
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className={`text-5xl font-bold tracking-tighter ${getQColor(Q)}`}>
                  {formatPercent(Q)}
               </span>
            </div>
          </div>
           <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">
            The probability of the prompt working correctly without human intervention.
           </p>
        </div>

        {/* Valuation Tiers */}
        <div className="space-y-4">
          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm h-full flex flex-col justify-center">
              <h3 className="text-[10px] text-cyber-cyan uppercase tracking-[0.2em] mb-4 font-bold">Valuation Tiers</h3>
              <div className="space-y-4">
                  <div className="group">
                      <p className="text-sm text-slate-400 group-hover:text-white transition-colors">True Asset Value (Internal)</p>
                      <p className="text-3xl text-white font-bold tracking-tight">{formatMoney(total_annual_value)}</p>
                  </div>
                  <div className="group">
                      <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Freelance Price (15%)</p>
                      <p className="text-2xl text-cyber-green font-bold tracking-tight">{formatMoney(freelance_price)}</p>
                  </div>
                  <div className="group">
                      <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Marketplace Price (1%)</p>
                      <p className="text-xl text-purple-400 font-bold tracking-tight">{formatMoney(marketplace_price)}</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* 3. Financial Breakdown */}
       <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm">
         <h3 className="text-[10px] text-cyber-cyan uppercase tracking-[0.2em] mb-6 font-bold flex items-center gap-2"><DollarSign size={14} /> Financial Breakdown (Per Run)</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-cyber-dark p-4 border border-cyber-gray/50 rounded-sm">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><TrendingUp size={12} /> Gross Value</p>
                <p className="text-2xl font-bold text-white">{formatMoney(gross_total_value)}</p>
            </div>
            <div className="bg-cyber-dark p-4 border border-cyber-gray/50 rounded-sm">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><TrendingDown size={12} /> Correction Tax</p>
                <p className="text-2xl font-bold text-cyber-red">-{formatMoney(correction_cost)}</p>
            </div>
            <div className={`p-4 border rounded-sm ${isViable ? 'bg-cyber-green/10 border-cyber-green' : 'bg-cyber-red/10 border-cyber-red'}`}>
                <p className={`text-xs uppercase tracking-widest mb-1 font-bold ${isViable ? 'text-cyber-green' : 'text-cyber-red'}`}>Net Utility</p>
                <p className="text-2xl font-bold text-white">{formatMoney(net_utility)}</p>
            </div>
         </div>
      </div>


       {/* 4. AUDIT LOG & ACTIONS */}
       <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray p-6 font-mono text-xs leading-relaxed relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-gray"></div>
         <div className="flex justify-between items-start mb-6">
            <div className="bg-cyber-gray px-3 py-1 text-[10px] text-white tracking-widest uppercase flex items-center gap-2 font-bold">
               <GitBranch size={10} /> V.E.C.T.O.R. Audit Log
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

export default VECTORResult;
