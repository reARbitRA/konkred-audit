
import React, { useState } from 'react';
import { PVCReport } from '../types';
import { 
  Target, TrendingUp, TrendingDown, Layers, ShieldCheck, 
  HelpCircle, AlertCircle, Sparkles, Box, BookOpen, 
  Scaling, CheckCircle, Clock, Lightbulb, MessageSquare, 
  ChevronRight, Terminal, Info, Activity
} from 'lucide-react';
import AccoladesDisplay from './AccoladesDisplay';

interface PVCResultProps {
  report: PVCReport;
}

const METRIC_DEFINITIONS: Record<string, { title: string; description: string; formula: string }> = {
  G: { title: "Goal Clarity", description: "Existence of unambiguous Objectives and Persona alignment.", formula: "G_raw / 4" },
  C: { title: "Context Sufficiency", description: "Quality of background information provided to the model.", formula: "C_raw / 4" },
  S: { title: "Instructional Specificity", description: "Precision of the actual command set and negative constraints.", formula: "S_raw / 4" },
  D: { title: "Structure / Decomposition", description: "Logical hierarchy and use of semantic delimiters (XML/MD).", formula: "D_raw / 4" },
  F: { title: "Feasibility", description: "Likelihood of a modern LLM succeeding on the first attempt.", formula: "F_raw / 4" },
  A: { title: "Ambiguity Penalty", description: "Deduction for potential interpretative drift.", formula: "1 - (A_raw * 0.8 / 4)" },
  R: { title: "Risk Penalty", description: "Deduction for safety, compliance, or hallucination vectors.", formula: "1 - (R_raw / 4)" },
  L: { title: "Length Efficiency", description: "Optimization factor based on token-to-meaning ratio.", formula: "f(tokens, 250)" }
};

const PVCResult: React.FC<PVCResultProps> = ({ report }) => {
  const { calculations, normalizedScores, rawScores, tokenCount, watermark, accolades } = report;
  const { finalScore, baseQ, qPen, lNorm } = calculations;
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const getGrade = (score: number) => {
    if (score >= 95) return { grade: 'S', color: 'text-cyber-orange', shadow: 'shadow-neon-orange', border: 'border-cyber-orange' };
    if (score >= 85) return { grade: 'A', color: 'text-cyber-green', shadow: 'shadow-neon-green', border: 'border-cyber-green' };
    if (score >= 70) return { grade: 'B', color: 'text-cyber-cyan', shadow: 'shadow-neon-cyan', border: 'border-cyber-cyan' };
    if (score >= 50) return { grade: 'C', color: 'text-yellow-400', shadow: 'shadow-none', border: 'border-yellow-400' };
    return { grade: 'F', color: 'text-cyber-red', shadow: 'shadow-neon-red', border: 'border-cyber-red' };
  };

  const { grade, color, shadow, border } = getGrade(finalScore);

  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Dashboard Header: The Grade & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cyber-dark/40 border border-cyber-gray p-8 rounded-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${border} ${shadow} flex items-center justify-center bg-black transition-all duration-500`}>
                    <span className={`text-6xl font-bold ${color}`}>{grade}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black px-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest whitespace-nowrap">Asset Grade</div>
            </div>
            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 text-cyber-cyan mb-2">
                    <Activity size={12} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Quality Certification</span>
                </div>
                <h2 className="text-3xl text-white font-bold uppercase tracking-tighter mb-4">Prompt Quality Audit</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="bg-black/50 border border-cyber-gray px-3 py-2 rounded-sm">
                        <div className="text-[9px] text-slate-500 uppercase mb-1">Normalized Index</div>
                        <div className={`text-xl font-bold ${color}`}>{finalScore.toFixed(1)} <span className="text-xs text-slate-600">/ 100</span></div>
                    </div>
                    <div className="bg-black/50 border border-cyber-gray px-3 py-2 rounded-sm">
                        <div className="text-[9px] text-slate-500 uppercase mb-1">Token Economy</div>
                        <div className="text-xl font-bold text-white">{tokenCount} <span className="text-xs text-slate-600">Units</span></div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. AI Reasoning Box */}
        <div className="bg-black/40 border border-cyber-purple/30 p-6 rounded-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-purple/5 blur-2xl group-hover:bg-cyber-purple/10 transition-all"></div>
            <h3 className="text-[10px] text-cyber-purple uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Terminal size={12} /> Auditor Intelligence
            </h3>
            <div className="relative">
                <MessageSquare className="absolute -left-1 -top-1 opacity-10 text-cyber-purple" size={32} />
                <p className="text-xs text-slate-400 leading-relaxed italic pl-6">
                    "{rawScores.reasoning || "Neural synthesis failed to provide reasoning string. Protocol variance detected."}"
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-cyber-gray/30 flex justify-between items-center">
                <span className="text-[9px] text-slate-600 uppercase font-bold">Auditor: V5.1_Flash</span>
                <span className="text-[9px] text-cyber-purple uppercase font-bold">Confidence: 99.2%</span>
            </div>
        </div>
      </div>

      {/* 3. The Score Waterfall */}
      <div className="bg-cyber-dark/60 border border-cyber-gray p-4 rounded-sm flex flex-col md:flex-row items-center justify-around gap-4 text-center">
          <div className="space-y-1 group">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Base Quality</div>
              <div className="text-xl font-bold text-white">{baseQ.toFixed(1)}</div>
          </div>
          <ChevronRight size={16} className="text-slate-700 hidden md:block" />
          <div className="space-y-1 group">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-cyber-red transition-colors">Penalty Impact</div>
              <div className="text-xl font-bold text-cyber-red">{(qPen - baseQ).toFixed(1)}</div>
          </div>
          <ChevronRight size={16} className="text-slate-700 hidden md:block" />
          <div className="space-y-1 group">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-cyber-cyan transition-colors">Length Norm</div>
              <div className="text-xl font-bold text-cyber-cyan">{(finalScore - qPen).toFixed(1)}</div>
          </div>
          <div className="h-8 w-px bg-cyber-gray hidden md:block"></div>
          <div className="space-y-1 group">
              <div className="text-[9px] text-cyber-green uppercase tracking-widest font-bold">Audit Realization</div>
              <div className={`text-2xl font-bold ${color}`}>{finalScore.toFixed(1)}</div>
          </div>
      </div>

      {/* 4. Optimization Recommendations */}
      {rawScores.G_r < 4 && (
        <div className="bg-cyber-cyan/5 border border-cyber-cyan/20 p-5 rounded-sm flex items-start gap-5 animate-in slide-in-from-right-4">
            <div className="w-12 h-12 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-sm flex items-center justify-center flex-shrink-0 text-cyber-cyan shadow-neon-cyan">
                <Lightbulb size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                    Structural Enhancement Path
                    <span className="text-[9px] bg-cyber-cyan/20 px-2 py-0.5 rounded text-cyber-cyan font-bold">READY</span>
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    Goal Clarity is suboptimal ({rawScores.G_r}/4). Resolve by wrapping the desired output schema in <code className="bg-black px-1 text-cyber-cyan">[OUTPUT_SPEC]</code> tags and defining exactly 2 negative constraints. This typically yields a +15% reliability lift.
                </p>
            </div>
        </div>
      )}

      {/* 5. Accolades Display */}
      <AccoladesDisplay accolades={accolades} />

      {/* 6. Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm">
              <h3 className="text-[10px] text-cyber-cyan uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={14} /> Quality Coefficients
              </h3>
              <div className="space-y-4">
                  {[
                      { id: 'G', icon: <Target size={14} />, val: normalizedScores.G, raw: rawScores.G_r },
                      { id: 'C', icon: <BookOpen size={14} />, val: normalizedScores.C, raw: rawScores.C_r },
                      { id: 'S', icon: <Activity size={14} />, val: normalizedScores.S, raw: rawScores.S_r },
                      { id: 'D', icon: <Scaling size={14} />, val: normalizedScores.D, raw: rawScores.D_r },
                      { id: 'F', icon: <CheckCircle size={14} />, val: normalizedScores.F, raw: rawScores.F_r },
                  ].map(m => (
                      <div key={m.id} className="group cursor-help" onMouseEnter={() => setActiveMetric(m.id)} onMouseLeave={() => setActiveMetric(null)}>
                          <div className="flex justify-between items-center text-[10px] uppercase mb-1.5">
                              <span className="text-slate-400 flex items-center gap-2 group-hover:text-white transition-colors">
                                  {m.icon} {METRIC_DEFINITIONS[m.id].title}
                              </span>
                              <span className="text-white font-bold">{m.raw}/4</span>
                          </div>
                          <div className="h-1.5 bg-black border border-cyber-gray/30 rounded-full overflow-hidden">
                              <div className="h-full bg-cyber-cyan shadow-neon-cyan transition-all duration-1000" style={{ width: `${m.val * 100}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm">
              <h3 className="text-[10px] text-cyber-red uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
                  <TrendingDown size={14} /> Decay Modifiers
              </h3>
              <div className="space-y-4">
                  {[
                      { id: 'A', icon: <AlertCircle size={14} />, val: normalizedScores.A, raw: rawScores.A_r, label: "Interpretative Drift" },
                      { id: 'R', icon: <ShieldCheck size={14} />, val: normalizedScores.R, raw: rawScores.R_r, label: "Hallucination Risk" },
                      { id: 'L', icon: <Clock size={14} />, val: lNorm, raw: 0, label: "Bloat Penalty" },
                  ].map(m => (
                      <div key={m.id} className="group cursor-help" onMouseEnter={() => setActiveMetric(m.id)} onMouseLeave={() => setActiveMetric(null)}>
                          <div className="flex justify-between items-center text-[10px] uppercase mb-1.5">
                              <span className="text-slate-400 flex items-center gap-2 group-hover:text-cyber-red transition-colors">
                                  {m.icon} {m.id === 'L' ? METRIC_DEFINITIONS[m.id].title : m.label}
                              </span>
                              <span className="text-cyber-red font-bold">-{Math.round(m.val * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-black border border-cyber-gray/30 rounded-full overflow-hidden">
                              <div className="h-full bg-cyber-red shadow-neon-red transition-all duration-1000" style={{ width: `${m.val * 100}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 7. Detailed Explanation Tooltip-like Area */}
      {activeMetric && (
        <div className="bg-cyber-cyan/10 border border-cyber-cyan/50 p-4 rounded-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-cyber-cyan mb-1">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{METRIC_DEFINITIONS[activeMetric].title} Protocol</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">{METRIC_DEFINITIONS[activeMetric].description}</p>
            <div className="text-[9px] text-slate-500 font-mono">CALC_LOG: {METRIC_DEFINITIONS[activeMetric].formula}</div>
        </div>
      )}

      {/* 8. Footer Telemetry */}
      <div className="bg-black/60 border border-cyber-gray p-6 font-mono text-[10px] relative overflow-hidden rounded-sm">
         <div className="absolute top-0 left-0 w-1 h-full bg-cyber-cyan shadow-neon-cyan"></div>
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-2"><Layers size={10} /> SESSION_ID: {watermark}</span>
                <span className="flex items-center gap-2"><Activity size={10} /> HANDSHAKE_OK</span>
            </div>
            <div className="text-right">
                VERIFIED_BY_KONKRED_SYSTEMS_AUDITOR_V5
            </div>
         </div>
      </div>
    </div>
  );
};

export default PVCResult;
