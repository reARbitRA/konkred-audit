
import React from 'react';
import { EAVPReport } from '../types';
import { FileText, Printer, ShieldCheck, HardHat, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

interface EAVPResultProps {
  report: EAVPReport;
}

const EAVPStamp: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`w-28 h-28 text-amber-400 ${className}`} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <circle cx="50" cy="50" r="48" strokeOpacity="0.3" />
    <circle cx="50" cy="50" r="42" strokeWidth="1" />
    <path id="curve" d="M 15, 50 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" stroke="none" />
    <text className="text-[7px] uppercase tracking-[0.2em] fill-current font-bold">
      <textPath href="#curve" startOffset="0%">
        Empirical Asset Verification Protocol
      </textPath>
      <textPath href="#curve" startOffset="50%">
        Verified Technical Audit
      </textPath>
    </text>
    <path d="M50 30 L50 70 M30 50 L70 50" strokeWidth="1" strokeOpacity="0.5" />
    <rect x="35" y="35" width="30" height="30" rx="3" className="fill-current opacity-20" />
    <path d="M45 45 L55 55 M45 55 L55 45" strokeWidth="3" strokeLinecap="round" className="stroke-current" />
  </svg>
);

const EAVPResult: React.FC<EAVPResultProps> = ({ report }) => {
  const { calculations, inputRequest, watermark, timestamp } = report;
  const { auditedValue, grossLaborValue, correctionCost, netMinutesSaved, manualCreationMinutes, correctionTaxMinutes } = calculations;

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatTime = (minutes: number) => {
    if (Math.abs(minutes) < 1) return `${(minutes * 60).toFixed(0)}s`;
    return `${minutes.toFixed(1)}m`;
  };
  
  const handleDownloadAsset = () => {
    const markdownContent = `
# ARBITRA E.A.V.P. AUDIT REPORT
**ID:** ${watermark}
**Date:** ${timestamp}
**Net Audited Value:** ${formatMoney(auditedValue)}

## AUDIT CALCULATION
- **Gross Labor Value:** ${formatMoney(grossLaborValue)} (Based on ${manualCreationMinutes.toFixed(1)} min of manual work)
- **Correction Tax:** -${formatMoney(correctionCost)} (Based on ${correctionTaxMinutes.toFixed(1)} min of correction work)
- **Net Minutes Saved:** ${netMinutesSaved.toFixed(1)} min

## INPUT TELEMETRY
- Output Characters: ${inputRequest.outputChars}
- User WPM: ${inputRequest.userWPM}
- Edit Time (min): ${inputRequest.editTime}
- Regenerations: ${inputRequest.regenerations}
- Market Rate ($/hr): ${inputRequest.marketRate}

---
**STATUS: VERIFIED AUDIT**
*Calculations are based on EAVP logic using deterministic performance data. This report represents a factual accounting of operational labor displacement and is valid for business intelligence purposes.*
    `.trim();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARBITRA_EAVP_AUDIT_${watermark}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const isProfitable = auditedValue > 0;

  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Certification Header */}
      <div className="bg-cyber-dark/40 border border-cyber-gray p-6 text-center rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
            <h2 className="text-amber-400 text-sm uppercase tracking-[0.3em] font-bold">Certification of Asset Value</h2>
            <p className="text-slate-500 text-xs mt-2">
                This report is generated using the EAVP (Empirical Asset Verification Protocol) and constitutes a Verified Technical Audit of operational efficiency.
            </p>
        </div>
      </div>
      
      {/* 2. Main Value Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className={`lg:col-span-2 p-8 border ${isProfitable ? 'border-cyber-green' : 'border-cyber-red'} bg-cyber-dark rounded-sm flex flex-col justify-center text-center relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1.5 h-full ${isProfitable ? 'bg-cyber-green shadow-neon-green' : 'bg-cyber-red shadow-neon-red'}`}></div>
            <div className={`absolute inset-0 ${isProfitable ? 'bg-cyber-green/5' : 'bg-cyber-red/5'} opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-fast`}></div>
            <div className="relative">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Net Audited Value (Per Run)</div>
                <div className={`text-6xl font-bold tracking-tighter ${isProfitable ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
                    {formatMoney(auditedValue)}
                </div>
                <div className={`mt-2 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isProfitable ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {isProfitable ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                    {isProfitable ? `NET GAIN OF ${formatTime(netMinutesSaved)}` : `NET LOSS OF ${formatTime(netMinutesSaved)}`}
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center p-4">
            <EAVPStamp className="opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* 3. Calculation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Labor Value */}
        <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm relative overflow-hidden group hover:border-cyber-green/50 transition-colors">
            <div className="absolute right-4 top-4 text-cyber-green/20 group-hover:text-cyber-green/50 transition-colors">
                <TrendingUp size={32} />
            </div>
            <h3 className="text-sm text-cyber-green uppercase tracking-widest flex items-center gap-2 font-bold mb-3">
                <HardHat size={14} /> Gross Labor Value
            </h3>
            <p className="text-3xl text-white font-bold tracking-tight">
                {formatMoney(grossLaborValue)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
                Value of <span className="text-white font-semibold">{formatTime(manualCreationMinutes)}</span> manual labor displaced.
            </p>
        </div>

        {/* Correction Tax */}
        <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm relative overflow-hidden group hover:border-cyber-red/50 transition-colors">
            <div className="absolute right-4 top-4 text-cyber-red/20 group-hover:text-cyber-red/50 transition-colors">
                <TrendingDown size={32} />
            </div>
            <h3 className="text-sm text-cyber-red uppercase tracking-widest flex items-center gap-2 font-bold mb-3">
                <AlertTriangle size={14} /> Correction Tax
            </h3>
            <p className="text-3xl text-white font-bold tracking-tight">
                -{formatMoney(correctionCost)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
                Cost of <span className="text-white font-semibold">{formatTime(correctionTaxMinutes)}</span> spent on rework & validation.
            </p>
        </div>
      </div>

      {/* 4. Input Telemetry & Actions */}
      <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray font-mono text-xs relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-gray"></div>
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="bg-cyber-gray px-3 py-1 text-[10px] text-white tracking-widest uppercase flex items-center gap-2 font-bold">
                    <DollarSign size={10} /> EAVP Telemetry Log
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                {[
                    { label: "Output Chars", value: inputRequest.outputChars.toLocaleString() },
                    { label: "User WPM", value: inputRequest.userWPM },
                    { label: "Edit Time (min)", value: inputRequest.editTime },
                    { label: "Regens", value: inputRequest.regenerations },
                    { label: "Rate ($/hr)", value: formatMoney(inputRequest.marketRate) }
                ].map(item => (
                    <div key={item.label} className="bg-cyber-dark p-3 border border-cyber-gray/50">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="text-lg text-white font-bold">{item.value}</div>
                    </div>
                ))}
            </div>
         </div>
         <div className="border-t border-cyber-gray bg-black/50 p-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider text-center">
                Status: Verified Audit | Calculations based on EAVP logic using deterministic performance data.
            </p>
         </div>
      </div>
    </div>
  );
};

export default EAVPResult;
