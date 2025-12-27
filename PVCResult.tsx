
import React from 'react';
import { PVCReport } from '../types';
import { Target, TrendingUp, TrendingDown, Layers, FileText, Printer, ShieldCheck, HelpCircle, AlertCircle, Sparkles, Box, BookOpen, Scaling, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import AccoladesDisplay from './AccoladesDisplay';

interface PVCResultProps {
  report: PVCReport;
}

const METRIC_DEFINITIONS: Record<string, { title: string; description: string; }> = {
  G: { title: "Goal Clarity", description: "Presence of Role, Objective, and EXACT Output Specification." },
  C: { title: "Context Sufficiency", description: "Does the prompt provide enough background information?" },
  S: { title: "Instructional Specificity", description: "How well the output requirements are defined." },
  D: { title: "Structure / Decomposition", description: "Is the task organized logically for the model?" },
  F: { title: "Feasibility", description: "Can the model realistically perform this task?" },
  A: { title: "Ambiguity Penalty", description: "Reduces score based on how many harmful interpretations exist." },
  R: { title: "Risk Penalty", description: "Reduces score based on safety and compliance risks." },
  L: { title: "Length Penalty", description: "Reduces score for being too short or too long." }
};

const MetricGauge: React.FC<{ icon: React.ReactNode, metricKey: string, value: number, rawValue: number, isPenalty?: boolean }> = ({ icon, metricKey, value, rawValue, isPenalty = false }) => {
  const radius = 24;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value * circumference);

  return (
    <div className="flex items-center gap-4 group p-2 rounded-sm hover:bg-white/5 transition-colors duration-300">
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg height="48" width="48" className="transform -rotate-90">
          <circle stroke="#333" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
          <circle
            stroke={isPenalty ? '#ff2a2a' : '#00f0ff'}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${isPenalty ? 'text-cyber-red' : 'text-cyber-cyan'}`}>
            {icon}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
          <span className="text-slate-400 flex items-center gap-1 cursor-help" title={METRIC_DEFINITIONS[metricKey].description}>
            {METRIC_DEFINITIONS[metricKey].title}
            <HelpCircle size={10} className="opacity-50" />
          </span>
          <span className={`font-bold ${isPenalty ? 'text-cyber-red' : 'text-white'}`}>
            {isPenalty ? `${(value * 100).toFixed(0)}%` : `${rawValue}/4`}
          </span>
        </div>
      </div>
    </div>
  );
};

const PVCResult: React.FC<PVCResultProps> = ({ report }) => {
  const { calculations, normalizedScores, rawScores, tokenCount, watermark, timestamp, inputPrompt, accolades } = report;
  const { finalScore, baseQ, qPen, lNorm } = calculations;

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-cyber-green text-glow-green';
    if (score > 50) return 'text-yellow-400';
    return 'text-cyber-red text-glow-red';
  };
  
  const getStrokeColor = (score: number) => {
    if (score > 80) return '#0aff00';
    if (score > 50) return '#facc15';
    return '#ff2a2a';
  };

  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (finalScore / 100 * circumference);

  const handleDownloadAsset = () => {
    const markdownContent = `
# KONKRED P.V.C. AUDIT REPORT
**ID:** ${watermark}
**Date:** ${timestamp}
**Final Score:** ${finalScore.toFixed(1)} / 100
...
    `.trim();
    // ... Blob download logic ...
  };

  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Main Score Display */}
      <div className="bg-cyber-dark/40 backdrop-blur-sm border border-cyber-gray p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 rounded-sm">
        <div className="relative">
          <svg height="160" width="160" className="transform -rotate-90">
            <circle stroke="#1a1a1a" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
            <circle
              stroke={getStrokeColor(finalScore)}
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className={`text-5xl font-bold tracking-tighter ${getScoreColor(finalScore)}`}>
                {finalScore.toFixed(1)}
             </span>
             <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Quality Score</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl text-white font-bold uppercase tracking-wider">Valuation Complete</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg">
            High quality prompts ensure consistent outputs. Low clarity leads to semantic drift and operational friction.
          </p>
        </div>
      </div>

      {/* 2. Clarity Optimizer (Dynamic Advice) */}
      {rawScores.G_r < 4 && (
        <div className="bg-cyber-cyan/5 border border-cyber-cyan/30 p-5 rounded-sm flex items-start gap-4 animate-in slide-in-from-right-4">
            <div className="w-10 h-10 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-full flex items-center justify-center flex-shrink-0 text-cyber-cyan">
                <Lightbulb size={20} />
            </div>
            <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Clarity Optimizer Recommendation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Your **Goal Clarity** score is {rawScores.G_r}/4. To reach a perfect score, explicitly define your desired output format 
                    (e.g., <code className="text-cyber-cyan font-bold">"Respond in XML using schema X"</code>) and provide 
                    <code className="text-cyber-red font-bold">negative constraints</code> to prevent hallucination (e.g., "Do not include preambles").
                </p>
            </div>
        </div>
      )}

      {/* 3. Accolades Display */}
      <AccoladesDisplay accolades={accolades} />

      {/* 4. Score Calculation Waterfall */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-cyber-gray overflow-hidden rounded-sm">
        {[
          { label: "Base Quality", value: baseQ, icon: <Sparkles size={16}/> },
          { label: "After Penalties", value: qPen, icon: <ShieldCheck size={16}/>, delta: qPen - baseQ },
          { label: "Token Count", value: tokenCount, icon: <Layers size={16}/> },
          { label: "Final Score", value: finalScore, icon: <Target size={16}/>, isFinal: true },
        ].map(item => (
          <div key={item.label} className="bg-cyber-dark p-4 text-center group relative">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                {item.icon} {item.label}
             </div>
             <div className={`text-2xl font-bold ${item.isFinal ? getScoreColor(item.value) : 'text-white'}`}>
                {item.value.toFixed(1)}
             </div>
             {item.delta != null && (
                <span className={`text-xs ${item.delta < 0 ? 'text-cyber-red' : 'text-cyber-green'}`}>
                  {item.delta.toFixed(1)}
                </span>
             )}
          </div>
        ))}
      </div>

      {/* 5. Metrics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm">
             <h3 className="text-[10px] text-cyber-cyan uppercase tracking-widest flex items-center gap-2 mb-4 font-bold">
                <TrendingUp size={12} /> Quality Composition
             </h3>
             <div className="space-y-2">
                <MetricGauge icon={<Target size={16}/>} metricKey="G" value={normalizedScores.G} rawValue={rawScores.G_r} />
                <MetricGauge icon={<BookOpen size={16}/>} metricKey="C" value={normalizedScores.C} rawValue={rawScores.C_r} />
                <MetricGauge icon={<Box size={16}/>} metricKey="S" value={normalizedScores.S} rawValue={rawScores.S_r} />
                <MetricGauge icon={<Scaling size={16}/>} metricKey="D" value={normalizedScores.D} rawValue={rawScores.D_r} />
                <MetricGauge icon={<CheckCircle size={16}/>} metricKey="F" value={normalizedScores.F} rawValue={rawScores.F_r} />
             </div>
          </div>
          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm">
             <h3 className="text-[10px] text-cyber-red uppercase tracking-widest flex items-center gap-2 mb-4 font-bold">
                <TrendingDown size={12} /> Penalty Modifiers
             </h3>
             <div className="space-y-2">
                <MetricGauge icon={<AlertCircle size={16}/>} metricKey="A" value={normalizedScores.A} rawValue={rawScores.A_r} isPenalty />
                <MetricGauge icon={<ShieldCheck size={16}/>} metricKey="R" value={normalizedScores.R} rawValue={rawScores.R_r} isPenalty />
                <MetricGauge icon={<Clock size={16}/>} metricKey="L" value={lNorm} rawValue={0} isPenalty />
             </div>
          </div>
      </div>

       {/* 6. AUDIT LOG & ACTIONS */}
       <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray p-6 font-mono text-xs leading-relaxed relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-gray"></div>
         <div className="flex justify-between items-start mb-6">
            <div className="bg-cyber-gray px-3 py-1 text-[10px] text-white tracking-widest uppercase flex items-center gap-2 font-bold">
               <Layers size={10} /> PVC Audit Log
            </div>
            
            <div className="flex gap-3 print:hidden">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-[10px] bg-cyber-dark border border-cyber-gray hover:border-cyber-red text-slate-400 hover:text-white px-3 py-1 transition-all uppercase tracking-wider"
              >
                 <Printer size={12} /> Export Dossier
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PVCResult;
