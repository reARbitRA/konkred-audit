// components/SmartAnalyzer.tsx

import React, { useState } from 'react';
import { 
  Zap, Play, Loader2, Sparkles, Settings, ChevronDown,
  DollarSign, Shield, Tag, GitBranch, Clock, Edit3
} from 'lucide-react';

interface EstimatedValues {
  // DLA
  hourlyWage: number;
  typingWPM: number;
  estimatedOutputChars: number;
  estimatedLatency: number;
  estimatedReviewTime: number;
  estimatedFixTime: number;
  apiCostPer1k: number;
  
  // EAVP
  actualEditTime: number;
  
  // PRICE
  yearlyVolume: number;
  reliabilityScore: number;
  
  // VECTOR
  constraintScore: number;
  contextScore: number;
  feasibilityScore: number;
  safetyFactor: number;
}

interface PromptAnalysis {
  charCount: number;
  wordCount: number;
  hasHardConstraints: boolean;
  hardConstraintCount: number;
  hasSoftConstraints: boolean;
  hasOutputFormat: boolean;
  hasExamples: boolean;
  hasContext: boolean;
  complexityLevel: 'simple' | 'moderate' | 'complex';
  estimatedOutputLength: 'short' | 'medium' | 'long';
  taskType: 'creative' | 'analytical' | 'technical' | 'conversational';
  isRepeatable: boolean;
}

const SmartAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [estimates, setEstimates] = useState<EstimatedValues | null>(null);
  const [showAdjustments, setShowAdjustments] = useState(false);

  // ==========================================
  // 🧠 SMART ANALYSIS ENGINE
  // ==========================================
  
  const analyzePrompt = (text: string): PromptAnalysis => {
    const words = text.split(/\s+/).filter(Boolean);
    const chars = text.length;
    
    // Detect hard constraints (specific, measurable requirements)
    const hardConstraintPatterns = [
      /\b(exactly|must be|maximum|minimum|only|no more than|at least)\b/gi,
      /\b(JSON|XML|CSV|markdown|HTML)\b/gi,
      /\b(\d+\s*(words?|characters?|sentences?|paragraphs?|items?|lines?))\b/gi,
      /\b(format:|output:|return:|respond with:)\b/gi,
    ];
    
    const hardConstraintCount = hardConstraintPatterns.reduce((count, pattern) => {
      const matches = text.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // Detect soft constraints (vague, subjective requirements)
    const softConstraintPatterns = [
      /\b(professional|concise|clear|brief|detailed|friendly)\b/gi,
      /\b(good|nice|appropriate|suitable)\b/gi,
    ];
    
    const hasSoftConstraints = softConstraintPatterns.some(p => p.test(text));
    
    // Detect output format specification
    const hasOutputFormat = /\b(format|structure|template|schema|output)\b/i.test(text);
    
    // Detect examples
    const hasExamples = /\b(example|e\.g\.|for instance|such as|like this)\b/i.test(text) ||
                        /```/.test(text) ||
                        /"[^"]{10,}"/.test(text);
    
    // Detect context
    const hasContext = /\b(background|context|situation|scenario|given that|assuming)\b/i.test(text) ||
                       words.length > 50;
    
    // Complexity assessment
    let complexityLevel: 'simple' | 'moderate' | 'complex' = 'simple';
    if (words.length > 100 || hardConstraintCount > 3) complexityLevel = 'complex';
    else if (words.length > 30 || hardConstraintCount > 1) complexityLevel = 'moderate';
    
    // Estimate output length
    let estimatedOutputLength: 'short' | 'medium' | 'long' = 'medium';
    if (/\b(brief|short|quick|summary|one-liner)\b/i.test(text)) estimatedOutputLength = 'short';
    else if (/\b(detailed|comprehensive|thorough|extensive|full)\b/i.test(text)) estimatedOutputLength = 'long';
    
    // Task type detection
    let taskType: 'creative' | 'analytical' | 'technical' | 'conversational' = 'analytical';
    if (/\b(write|create|generate|compose|story|poem|creative)\b/i.test(text)) taskType = 'creative';
    else if (/\b(code|function|API|debug|script|program)\b/i.test(text)) taskType = 'technical';
    else if (/\b(reply|respond|chat|conversation|message)\b/i.test(text)) taskType = 'conversational';
    
    // Is this a repeatable task?
    const isRepeatable = /\b(template|every|each|all|batch|multiple|automate)\b/i.test(text) ||
                         taskType === 'technical' ||
                         taskType === 'conversational';
    
    return {
      charCount: chars,
      wordCount: words.length,
      hasHardConstraints: hardConstraintCount > 0,
      hardConstraintCount,
      hasSoftConstraints,
      hasOutputFormat,
      hasExamples,
      hasContext,
      complexityLevel,
      estimatedOutputLength,
      taskType,
      isRepeatable,
    };
  };

  const generateEstimates = (analysis: PromptAnalysis): EstimatedValues => {
    // Output character estimation
    const outputMultipliers = { short: 500, medium: 1500, long: 4000 };
    const estimatedOutputChars = outputMultipliers[analysis.estimatedOutputLength];
    
    // Wage estimation based on task type
    const wageByTask = { 
      creative: 75, 
      analytical: 85, 
      technical: 120, 
      conversational: 50 
    };
    
    // Latency estimation (seconds)
    const latencyByComplexity = { simple: 3, moderate: 8, complex: 15 };
    
    // Review time estimation (minutes)
    const reviewByOutput = { short: 1, medium: 3, long: 8 };
    
    // Fix time estimation based on constraints
    const baseFixTime = analysis.hasHardConstraints ? 2 : 5;
    const fixTimeReduction = Math.min(analysis.hardConstraintCount * 0.5, 3);
    
    // Volume estimation
    let yearlyVolume = 50; // Default: one-off
    if (analysis.isRepeatable) {
      if (analysis.taskType === 'conversational') yearlyVolume = 5000;
      else if (analysis.taskType === 'technical') yearlyVolume = 500;
      else yearlyVolume = 200;
    }
    
    // Reliability based on constraint quality
    let reliabilityScore = 0.6;
    if (analysis.hasHardConstraints) reliabilityScore += 0.15;
    if (analysis.hasOutputFormat) reliabilityScore += 0.1;
    if (analysis.hasExamples) reliabilityScore += 0.1;
    if (analysis.hasContext) reliabilityScore += 0.05;
    reliabilityScore = Math.min(reliabilityScore, 0.98);
    
    // VECTOR scores
    const constraintScore = Math.min(0.3 + (analysis.hardConstraintCount * 0.15), 1);
    const contextScore = analysis.hasContext ? 0.85 : 0.5;
    const feasibilityScore = analysis.complexityLevel === 'simple' ? 0.9 :
                             analysis.complexityLevel === 'moderate' ? 0.75 : 0.6;
    
    return {
      hourlyWage: wageByTask[analysis.taskType],
      typingWPM: 45,
      estimatedOutputChars,
      estimatedLatency: latencyByComplexity[analysis.complexityLevel],
      estimatedReviewTime: reviewByOutput[analysis.estimatedOutputLength],
      estimatedFixTime: Math.max(baseFixTime - fixTimeReduction, 1),
      apiCostPer1k: 0.02,
      actualEditTime: Math.max(baseFixTime - fixTimeReduction + 1, 2),
      yearlyVolume,
      reliabilityScore,
      constraintScore,
      contextScore,
      feasibilityScore,
      safetyFactor: 0.95,
    };
  };

  const runSmartAnalysis = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const promptAnalysis = analyzePrompt(prompt);
    const estimatedValues = generateEstimates(promptAnalysis);
    
    setAnalysis(promptAnalysis);
    setEstimates(estimatedValues);
    setIsAnalyzing(false);
  };

  // Calculate final values
  const calculateDLA = () => {
    if (!estimates) return null;
    const manualTime = estimates.estimatedOutputChars / 5 / estimates.typingWPM; // minutes
    const manualCost = (manualTime / 60) * estimates.hourlyWage;
    const aiTime = (estimates.estimatedLatency / 60) + estimates.estimatedReviewTime + estimates.estimatedFixTime;
    const aiCost = (aiTime / 60) * estimates.hourlyWage + (estimates.estimatedOutputChars / 1000) * estimates.apiCostPer1k;
    return {
      manualCost: manualCost.toFixed(2),
      aiCost: aiCost.toFixed(2),
      netSavings: (manualCost - aiCost).toFixed(2),
      isProfitable: manualCost > aiCost
    };
  };

  const calculatePRICE = () => {
    if (!estimates) return null;
    const dla = calculateDLA();
    if (!dla) return null;
    const netPerRun = parseFloat(dla.netSavings);
    const tav = netPerRun * estimates.yearlyVolume * estimates.reliabilityScore;
    return {
      tav: tav.toFixed(0),
      freelancePrice: (tav * 0.15).toFixed(0),
      marketplacePrice: (tav * 0.02).toFixed(0)
    };
  };

  const calculateVECTOR = () => {
    if (!estimates) return null;
    const q = Math.pow(
      estimates.constraintScore * estimates.contextScore * estimates.feasibilityScore, 
      1/3
    ) * estimates.safetyFactor;
    return {
      qScore: q.toFixed(2),
      isViable: q >= 0.5,
      verdict: q >= 0.7 ? 'PRODUCTION READY' : q >= 0.5 ? 'NEEDS REVIEW' : 'SCRAP ASSET'
    };
  };

  return (
    <div className="bg-cyber-dark border border-cyber-cyan/30 rounded-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-purple/20 via-cyber-cyan/10 to-transparent p-4 border-b border-cyber-cyan/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="text-cyber-purple" size={24} />
            <div className="absolute inset-0 blur-md bg-cyber-purple/50 animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold uppercase tracking-wider">
              Smart Pre-fill Engine
            </h2>
            <p className="text-cyber-cyan/60 text-[10px] font-mono uppercase">
              AI estimates all protocol inputs from your prompt
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="p-4 border-b border-cyber-gray/30">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your prompt here... The engine will analyze it and estimate all required values for DLA, EAVP, PRICE, and VECTOR protocols."
          className="w-full h-32 bg-black/60 border border-cyber-gray/30 rounded-sm p-4 
                     font-mono text-sm text-white placeholder:text-slate-600
                     focus:border-cyber-cyan/50 focus:outline-none resize-none"
        />

        <button
          onClick={runSmartAnalysis}
          disabled={!prompt.trim() || isAnalyzing}
          className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 
                      font-mono text-sm font-bold uppercase tracking-wider rounded-sm
                      transition-all duration-300
                      ${!prompt.trim() || isAnalyzing
                        ? 'bg-cyber-gray/20 text-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyber-purple/30 to-cyber-cyan/30 text-white border border-cyber-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                      }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing Prompt Structure...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Smart Analyze & Estimate
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && estimates && (
        <div className="p-4 space-y-4">
          
          {/* Prompt Analysis Summary */}
          <div className="bg-black/40 border border-cyber-gray/30 rounded-sm p-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyber-cyan mb-3">
              Detected Prompt Characteristics
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-black/40 p-2 rounded-sm">
                <div className="text-slate-500">Complexity</div>
                <div className={`font-bold ${
                  analysis.complexityLevel === 'simple' ? 'text-cyber-green' :
                  analysis.complexityLevel === 'moderate' ? 'text-cyber-orange' : 'text-cyber-red'
                }`}>
                  {analysis.complexityLevel.toUpperCase()}
                </div>
              </div>
              <div className="bg-black/40 p-2 rounded-sm">
                <div className="text-slate-500">Task Type</div>
                <div className="font-bold text-white">{analysis.taskType}</div>
              </div>
              <div className="bg-black/40 p-2 rounded-sm">
                <div className="text-slate-500">Hard Constraints</div>
                <div className={`font-bold ${analysis.hardConstraintCount > 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                  {analysis.hardConstraintCount} found
                </div>
              </div>
              <div className="bg-black/40 p-2 rounded-sm">
                <div className="text-slate-500">Repeatable?</div>
                <div className={`font-bold ${analysis.isRepeatable ? 'text-cyber-cyan' : 'text-slate-400'}`}>
                  {analysis.isRepeatable ? 'YES' : 'NO'}
                </div>
              </div>
            </div>
          </div>

          {/* Adjustable Estimates */}
          <div className="bg-black/40 border border-cyber-orange/30 rounded-sm overflow-hidden">
            <button
              onClick={() => setShowAdjustments(!showAdjustments)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-cyber-orange" />
                <span className="text-xs font-bold uppercase text-cyber-orange">
                  Review & Adjust Estimates
                </span>
              </div>
              <ChevronDown size={14} className={`text-cyber-orange transition-transform ${showAdjustments ? 'rotate-180' : ''}`} />
            </button>
            
            {showAdjustments && (
              <div className="p-4 border-t border-cyber-gray/30 grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Editable fields */}
                {[
                  { label: 'Hourly Wage', key: 'hourlyWage', prefix: '$' },
                  { label: 'Output Chars', key: 'estimatedOutputChars', prefix: '' },
                  { label: 'Review Time (min)', key: 'estimatedReviewTime', prefix: '' },
                  { label: 'Fix Time (min)', key: 'estimatedFixTime', prefix: '' },
                  { label: 'Yearly Volume', key: 'yearlyVolume', prefix: '' },
                  { label: 'Reliability %', key: 'reliabilityScore', prefix: '', isPercent: true },
                  { label: 'Constraint Score', key: 'constraintScore', prefix: '', isPercent: true },
                  { label: 'Context Score', key: 'contextScore', prefix: '', isPercent: true },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase">{field.label}</label>
                    <input
                      type="number"
                      value={field.isPercent 
                        ? ((estimates as any)[field.key] * 100).toFixed(0)
                        : (estimates as any)[field.key]
                      }
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEstimates(prev => prev ? {
                          ...prev,
                          [field.key]: field.isPercent ? val / 100 : val
                        } : null);
                      }}
                      className="w-full bg-black border border-cyber-gray/30 rounded-sm px-2 py-1 
                                 text-white text-xs font-mono focus:border-cyber-cyan/50 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Protocol Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* D.L.A. Result */}
            {(() => {
              const dla = calculateDLA();
              if (!dla) return null;
              return (
                <div className={`p-4 rounded-sm border ${dla.isProfitable ? 'bg-cyber-green/10 border-cyber-green/30' : 'bg-cyber-red/10 border-cyber-red/30'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={16} className={dla.isProfitable ? 'text-cyber-green' : 'text-cyber-red'} />
                    <span className="text-xs font-bold uppercase text-white">D.L.A. Result</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-400">${dla.manualCost}</div>
                      <div className="text-[9px] text-slate-500">MANUAL</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-cyber-cyan">${dla.aiCost}</div>
                      <div className="text-[9px] text-slate-500">AI COST</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${dla.isProfitable ? 'text-cyber-green' : 'text-cyber-red'}`}>
                        ${dla.netSavings}
                      </div>
                      <div className="text-[9px] text-slate-500">NET</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* P.R.I.C.E. Result */}
            {(() => {
              const price = calculatePRICE();
              if (!price) return null;
              return (
                <div className="p-4 rounded-sm border bg-cyber-cyan/10 border-cyber-cyan/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={16} className="text-cyber-cyan" />
                    <span className="text-xs font-bold uppercase text-white">P.R.I.C.E. Result</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">${price.tav}</div>
                      <div className="text-[9px] text-slate-500">TAV/YEAR</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-cyber-purple">${price.freelancePrice}</div>
                      <div className="text-[9px] text-slate-500">FREELANCE</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-cyber-orange">${price.marketplacePrice}</div>
                      <div className="text-[9px] text-slate-500">MARKET</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* V.E.C.T.O.R. Result */}
            {(() => {
              const vector = calculateVECTOR();
              if (!vector) return null;
              return (
                <div className={`p-4 rounded-sm border col-span-full ${
                  vector.isViable ? 'bg-cyber-green/10 border-cyber-green/30' : 'bg-cyber-red/10 border-cyber-red/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch size={16} className={vector.isViable ? 'text-cyber-green' : 'text-cyber-red'} />
                      <span className="text-xs font-bold uppercase text-white">V.E.C.T.O.R. Assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">Q = {vector.qScore}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-sm text-xs font-bold ${
                        vector.verdict === 'PRODUCTION READY' ? 'bg-cyber-green/20 text-cyber-green' :
                        vector.verdict === 'NEEDS REVIEW' ? 'bg-cyber-orange/20 text-cyber-orange' :
                        'bg-cyber-red/20 text-cyber-red'
                      }`}>
                        {vector.verdict}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Use These Values Button */}
          <button className="w-full py-3 bg-gradient-to-r from-cyber-green/30 to-cyber-cyan/30 
                             border border-cyber-green/50 rounded-sm
                             text-white font-mono text-sm font-bold uppercase tracking-wider
                             hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all">
            <Zap size={16} className="inline mr-2" />
            Apply Values to Full Protocol Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartAnalyzer;