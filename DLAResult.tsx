
import React from 'react';
import { DLAReport } from '../types';
import { 
  FileText, Printer, ShieldCheck, HardHat, AlertTriangle, CheckCircle, 
  TrendingDown, TrendingUp, DollarSign, Clock, Timer, BookOpen, Cpu,
  MessageSquare, Keyboard, Briefcase
} from 'lucide-react';

interface DLAResultProps {
  report: DLAReport;
}

const DLAResult: React.FC<DLAResultProps> = ({ report }) => {
  const { calculations, inputRequest, watermark, timestamp } = report;
  const { 
    trueNetValue, grossLaborValue, hiddenFrictionCost, manualMinutes, 
    waitCost, readingCost, fixingCost, isProfitable 
  } = calculations;

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const totalComparisonValue = grossLaborValue + hiddenFrictionCost;
  const valuePercentage = totalComparisonValue > 0 ? (grossLaborValue / totalComparisonValue) * 100 : 0;

  const handleDownloadAsset = () => {
    const markdownContent = `
# KONKRED D.L.A. AUDIT REPORT
**ID:** ${watermark}
**Date:** ${timestamp}

## FINAL VERDICT: ${isProfitable ? 'PROFITABLE' : 'UNPROFITABLE'}
**True Net Value (per run): ${formatMoney(trueNetValue)}**

---

## 1. FINANCIAL BREAKDOWN

| Metric                | Value            | Notes                                   |
|-----------------------|------------------|-----------------------------------------|
| **Gross Labor Value** | **${formatMoney(grossLaborValue)}**   | *Value of displaced manual labor.*      |
| **Hidden Friction Cost**| **-${formatMoney(hiddenFrictionCost)}** | *Total cost of AI operational drag.*      |
| **True Net Value**    | **${formatMoney(trueNetValue)}**   | *Realized profit or loss per run.*      |

---

## 2. FRICTION COST ANALYSIS (The Correction Tax)

The total friction cost of **${formatMoney(hiddenFrictionCost)}** is composed of:

- **Latency Cost (Wait):** ${formatMoney(waitCost)}
  - *Cost of human operator waiting for API response.*
- **Verification Cost (Read):** ${formatMoney(readingCost)}
  - *Cost of human operator reading/understanding the AI output.*
- **Correction Cost (Fix):** ${formatMoney(fixingCost)}
  - *Cost of human operator editing/fixing the AI output.*
- **API Hard Cost:** ${formatMoney(inputRequest.apiCostUsd)}
  - *Direct cost of the API call.*

---

## 3. INPUT TELEMETRY

- **Output Characters:** ${inputRequest.outputCharCount}
- **API Latency:** ${inputRequest.apiLatencySeconds} seconds
- **Edit Time:** ${inputRequest.editSessionSeconds} seconds
- **API Cost:** ${formatMoney(inputRequest.apiCostUsd)}
- **Human Write WPM:** ${inputRequest.humanWpm}
- **Human Read WPM:** ${inputRequest.humanReadingWpm}
- **Hourly Wage:** ${formatMoney(inputRequest.hourlyWage)}

---
**VALUATION PROTOCOL: DLA-Verified**
*This valuation is calculated using Differential Labor Arbitrage. It strictly measures the delta between manual production physics and verified AI interaction friction (latency, cognitive review load, and correction time).*
    `.trim();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KONKRED_DLA_AUDIT_${watermark}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="bg-cyber-dark/40 border border-cyber-gray p-6 text-center rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
            <h2 className="text-cyber-cyan text-sm uppercase tracking-[0.3em] font-bold">Differential Labor Arbitrage</h2>
            <p className="text-slate-500 text-xs mt-2">
                A physics-based valuation measuring the financial delta between manual labor and AI operational friction.
            </p>
        </div>
      </div>
      
      {/* Profitability Verdict */}
      <div className={`p-6 md:p-8 border-2 ${isProfitable ? 'border-cyber-green' : 'border-cyber-red'} ${isProfitable ? 'bg-cyber-green/10' : 'bg-cyber-red/10'} rounded-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left`}>
          <div className={`flex-shrink-0 ${isProfitable ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
              {isProfitable ? <CheckCircle size={48} className="animate-in zoom-in-50 duration-500" /> : <AlertTriangle size={48} className="animate-in zoom-in-50 duration-500" />}
          </div>
          <div className="flex-1">
              <h3 className={`font-bold text-white text-2xl uppercase tracking-wider mb-1 ${isProfitable ? 'text-glow-green' : 'text-glow-red'}`}>
                {isProfitable ? "Positive Arbitrage" : "Negative Arbitrage"}
              </h3>
              <p className="text-sm text-slate-400">
                  {isProfitable ? "The AI operation is profitable, saving more value than it costs in friction." : "The AI operation is unprofitable, costing more in friction than the value it creates."}
              </p>
          </div>
          <div className="text-center">
             <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">True Net Value</div>
             <div className={`text-4xl lg:text-5xl font-bold ${isProfitable ? 'text-cyber-green' : 'text-cyber-red'}`}>
                {formatMoney(trueNetValue)}
             </div>
          </div>
      </div>

      {/* Infographic */}
      <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm">
         <h3 className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Gross Labor Value vs. Hidden Friction Cost</h3>
         <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
               <span className="font-bold text-cyber-green flex items-center gap-2"><TrendingUp size={14}/> Gross Labor Value</span>
               <span className="font-bold text-white">{formatMoney(grossLaborValue)}</span>
            </div>
            <div className="w-full h-8 bg-cyber-dark border border-cyber-gray/50 rounded-sm overflow-hidden flex relative">
               <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
               <div className="h-full bg-gradient-to-r from-cyber-green/50 to-cyber-green shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" style={{ width: `${valuePercentage}%` }}></div>
               <div className="h-full bg-gradient-to-r from-cyber-red/50 to-cyber-red shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" style={{ width: `${100 - valuePercentage}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-sm">
               <span className="font-bold text-cyber-red flex items-center gap-2"><TrendingDown size={14}/> Hidden Friction Cost</span>
               <span className="font-bold text-white">-{formatMoney(hiddenFrictionCost)}</span>
            </div>
         </div>
      </div>

      {/* Friction Cost Breakdown Visualization */}
      <div className="bg-cyber-red/10 border border-cyber-red/30 p-6 rounded-sm">
        <h3 className="text-sm text-cyber-red uppercase tracking-widest flex items-center gap-2 font-bold mb-6">
            <AlertTriangle size={14} /> Friction Cost Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Latency (Wait)", value: waitCost, icon: <Timer size={24} />, max: hiddenFrictionCost },
              { label: "Verification (Read)", value: readingCost, icon: <BookOpen size={24} />, max: hiddenFrictionCost },
              { label: "Correction (Fix)", value: fixingCost, icon: <HardHat size={24} />, max: hiddenFrictionCost },
              { label: "API Hard Cost", value: inputRequest.apiCostUsd, icon: <Cpu size={24} />, max: hiddenFrictionCost },
            ].map(item => (
                <div key={item.label} className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#333"
                                strokeWidth="2"
                            />
                            <path
                                className="text-cyber-red"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray={`${(item.value / item.max) * 100}, 100`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-cyber-red/70">{item.icon}</div>
                    </div>
                    <p className="text-lg font-bold text-white mt-3">{formatMoney(item.value)}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Input Telemetry & Actions */}
      <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray font-mono text-xs relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-gray"></div>
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="bg-cyber-gray px-3 py-1 text-[10px] text-white tracking-widest uppercase flex items-center gap-2 font-bold">
                    <DollarSign size={10} /> DLA Telemetry Log
                </div>
                <div className="flex gap-3 print:hidden">
                    <button onClick={handleDownloadAsset} className="flex items-center gap-2 text-[10px] bg-cyber-dark border border-cyber-gray hover:border-cyber-cyan text-slate-400 hover:text-white px-3 py-1 transition-all uppercase tracking-wider">
                        <FileText size={12} /> Save Audit (.md)
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] bg-cyber-dark border border-cyber-gray hover:border-cyber-red text-slate-400 hover:text-white px-3 py-1 transition-all uppercase tracking-wider">
                        <Printer size={12} /> Export Dossier
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
                {[
                    { label: "Output Chars", value: inputRequest.outputCharCount.toLocaleString(), icon: <MessageSquare size={12}/> },
                    { label: "Latency (s)", value: inputRequest.apiLatencySeconds, icon: <Timer size={12}/> },
                    { label: "Edit Time (s)", value: inputRequest.editSessionSeconds, icon: <Clock size={12}/> },
                    { label: "API Cost", value: formatMoney(inputRequest.apiCostUsd), icon: <Cpu size={12}/> },
                    { label: "Write WPM", value: inputRequest.humanWpm, icon: <Keyboard size={12}/> },
                    { label: "Read WPM", value: inputRequest.humanReadingWpm, icon: <BookOpen size={12}/> },
                    { label: "Wage ($/hr)", value: inputRequest.hourlyWage.toFixed(2), icon: <Briefcase size={12}/> }
                ].map(item => (
                    <div key={item.label} className="bg-cyber-dark p-2 border border-cyber-gray/50">
                        <div className="text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">{item.icon} {item.label}</div>
                        <div className="text-base text-white font-bold">{item.value}</div>
                    </div>
                ))}
            </div>
         </div>
         <div className="border-t border-cyber-gray bg-black/50 p-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider text-center">
                Status: DLA-Verified | This report constitutes a factual accounting of operational labor displacement.
            </p>
         </div>
      </div>
    </div>
  );
};

export default DLAResult;
