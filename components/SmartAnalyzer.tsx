
import React, { useState, useEffect } from 'react';
import { 
  Zap, Play, Loader2, Sparkles, Settings, ChevronDown,
  DollarSign, Shield, Tag, GitBranch, CheckCircle2, X, Brain, Cpu
} from 'lucide-react';
import { ValuationRequest, PromptStructureAnalysis } from '../types';
import { analyzePromptStructure } from '../services/gemini';

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
  valuedParameter: string;
  parameterWeight: number;
  
  // VECTOR
  constraintScore: number;
  contextScore: number;
  feasibilityScore: number;
  safetyFactor: number;
}

interface SmartAnalyzerProps {
  initialPrompt?: string;
  onApply?: (data: Partial<ValuationRequest>) => void;
  onClose?: () => void;
}

const SmartAnalyzer: React.FC<SmartAnalyzerProps> = ({ initialPrompt = '', onApply, onClose }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PromptStructureAnalysis | null>(null);
  const [estimates, setEstimates] = useState<EstimatedValues | null>(null);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [engineMode, setEngineMode] = useState<'heuristic' | 'neural'>('heuristic');

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  // ==========================================
  // 🧠 HEURISTIC ENGINE (LOCAL REGEX)
  // ==========================================
  const analyzePromptHeuristic = (text: string): PromptStructureAnalysis => {
    const words = text.split(/\s+/).filter(Boolean);
    const chars = text.length;
    
    // Detect hard constraints
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
    
    const softConstraintPatterns = [/\b(professional|concise|clear|brief|detailed|friendly)\b/gi, /\b(good|nice|appropriate|suitable)\b/gi];
    const hasSoftConstraints = softConstraintPatterns.some(p => p.test(text));
    
    const hasOutputFormat = /\b(format|structure|template|schema|output)\b/i.test(text);
    const hasExamples = /\b(example|e\.g\.|for instance|such as|like this)\b/i.test(text) || /```/.test(text);
    const hasContext = /\b(background|context|situation|scenario|given that|assuming)\b/i.test(text) || words.length > 50;
    
    let complexityLevel: 'simple' | 'moderate' | 'complex' = 'simple';
    if (words.length > 100 || hardConstraintCount > 3) complexityLevel = 'complex';
    else if (words.length > 30 || hardConstraintCount > 1) complexityLevel = 'moderate';
    
    let estimatedOutputLength: 'short' | 'medium' | 'long' = 'medium';
    if (/\b(brief|short|quick|summary|one-liner)\b/i.test(text)) estimatedOutputLength = 'short';
    else if (/\b(detailed|comprehensive|thorough|extensive|full)\b/i.test(text)) estimatedOutputLength = 'long';
    
    let taskType: 'creative' | 'analytical' | 'technical' | 'conversational' = 'analytical';
    if (/\b(write|create|generate|compose|story|poem|creative)\b/i.test(text)) taskType = 'creative';
    else if (/\b(code|function|API|debug|script|program)\b/i.test(text)) taskType = 'technical';
    else if (/\b(reply|respond|chat|conversation|message)\b/i.test(text)) taskType = 'conversational';
    
    const isRepeatable = /\b(template|every|each|all|batch|multiple|automate)\b/i.test(text) || taskType === 'technical' || taskType === 'conversational';
    
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

  const generateEstimates = (analysis: PromptStructureAnalysis): EstimatedValues => {
    const outputMultipliers = { short: 500, medium: 1500, long: 4000 };
    const estimatedOutputChars = outputMultipliers[analysis.estimatedOutputLength];
    
    const wageByTask = { creative: 75, analytical: 85, technical: 120, conversational: 50 };
    const latencyByComplexity = { simple: 3, moderate: 8, complex: 15 };
    const reviewByOutput = { short: 1, medium: 3, long: 8 };
    
    const baseFixTime = analysis.hasHardConstraints ? 2 : 5;
    const fixTimeReduction = Math.min(analysis.hardConstraintCount * 0.5, 3);
    
    let yearlyVolume = 50;
    if (analysis.isRepeatable) {
      if (analysis.taskType === 'conversational') yearlyVolume = 5000;
      else if (analysis.taskType === 'technical') yearlyVolume = 500;
      else yearlyVolume = 200;
    }
    
    let reliabilityScore = 0.6;
    if (analysis.hasHardConstraints) reliabilityScore += 0.15;
    if (analysis.hasOutputFormat) reliabilityScore += 0.1;
    if (analysis.hasExamples) reliabilityScore += 0.1;
    if (analysis.hasContext) reliabilityScore += 0.05;
    reliabilityScore = Math.min(reliabilityScore, 0.98);

    // AUTO-IDENTIFY VALUED PARAMETER
    const parameterMap = {
        creative: 'Content Synthesis',
        analytical: 'Strategic Analysis',
        technical: 'Code Accuracy',
        conversational: 'Customer Intent'
    };
    
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
      valuedParameter: parameterMap[analysis.taskType],
      parameterWeight: analysis.complexityLevel === 'complex' ? 1.5 : 1.0,
      constraintScore: Math.min(0.3 + (analysis.hardConstraintCount * 0.15), 1),
      contextScore: analysis.hasContext ? 0.85 : 0.5,
      feasibilityScore: analysis.complexityLevel === 'simple' ? 0.9 : analysis.complexityLevel === 'moderate' ? 0.75 : 0.6,
      safetyFactor: 0.95,
    };
  };

  const runSmartAnalysis = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setEstimates(null);

    let promptAnalysis: PromptStructureAnalysis;

    // FIXED: Now correctly calling analyzePromptStructure when engineMode is 'neural'.
    if (engineMode === 'neural') {
        promptAnalysis = await analyzePromptStructure(prompt);
    } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        promptAnalysis = analyzePromptHeuristic(prompt);
    }
    
    const estimatedValues = generateEstimates(promptAnalysis);
    
    setAnalysis(promptAnalysis);
    setEstimates(estimatedValues);
    setIsAnalyzing(false);
  };

  const calculateDLA = () => {
    if (!estimates) return null;
    const manualTime = estimates.estimatedOutputChars / 5 / estimates.typingWPM;
    const manualCost = (manualTime / 60) * estimates.hourlyWage;
    const aiTime = (estimates.estimatedLatency / 60) + estimates.estimatedReviewTime + estimates.estimatedFixTime;
    const aiCost = (aiTime / 60) * estimates.hourlyWage + (estimates.estimatedOutputChars / 1000) * estimates.apiCostPer1k;
    return { manualCost: manualCost.toFixed(2), aiCost: aiCost.toFixed(2), netSavings: (manualCost - aiCost).toFixed(2), isProfitable: manualCost > aiCost };
  };

  const calculatePRICE = () => {
    if (!estimates) return null;
    const dla = calculateDLA();
    if (!dla) return null;
    const netPerRun = parseFloat(dla.netSavings);
    const tav = netPerRun * estimates.yearlyVolume * estimates.reliabilityScore * estimates.parameterWeight;
    return { tav: tav.toFixed(0), freelancePrice: (tav * 0.15).toFixed(0), marketplacePrice: (tav * 0.02).toFixed(0) };
  };

  const calculateVECTOR = () => {
    if (!estimates) return null;
    const q = Math.pow(estimates.constraintScore * estimates.contextScore * estimates.feasibilityScore, 1/3) * estimates.safetyFactor;
    return { qScore: q.toFixed(2), isViable: q >= 0.5, verdict: q >= 0.7 ? 'PRODUCTION READY' : q >= 0.5 ? 'NEEDS REVIEW' : 'SCRAP ASSET' };
  };

  const handleApplyValues = () => {
    if (!estimates || !onApply) return;
    
    const mappedData: Partial<ValuationRequest> = {
      inputPrompt: prompt,
      // DLA
      hourlyWage: estimates.hourlyWage,
      humanWpm: estimates.typingWPM,
      outputCharCount: estimates.estimatedOutputChars,
      apiLatencySeconds: estimates.estimatedLatency,
      editSessionSeconds: estimates.estimatedFixTime * 60,
      apiCostUsd: (estimates.estimatedOutputChars / 1000) * estimates.apiCostPer1k,
      
      // EAVP
      outputChars: estimates.estimatedOutputChars,
      userWPM: estimates.typingWPM,
      editTime: estimates.estimatedFixTime,
      marketRate: estimates.hourlyWage,
      regenerations: 0,
      
      // PRICE
      humanHourlyRate: estimates.hourlyWage,
      humanTimeMinutes: (estimates.estimatedOutputChars / 5) / estimates.typingWPM,
      reviewTimeMinutes: estimates.estimatedReviewTime,
      tokenCost: (estimates.estimatedOutputChars / 1000) * estimates.apiCostPer1k,
      reliability: estimates.reliabilityScore,
      yearlyVolume: estimates.yearlyVolume,
      valuedParameter: estimates.valuedParameter,
      parameterWeight: estimates.parameterWeight,
      
      // VECTOR
      human_hourly_rate: estimates.hourlyWage,
      annual_volume: estimates.yearlyVolume,
      api_cost_per_run: (estimates.estimatedOutputChars / 1000) * estimates.apiCostPer1k,
      time_saved_minutes: ((estimates.estimatedOutputChars / 5) / estimates.typingWPM) * 0.8,
      score_constraints: Math.round(estimates.constraintScore * 5),
      score_context: Math.round(estimates.contextScore * 5),
      score_feasibility: Math.round(estimates.feasibilityScore * 5),
      score_safety: Math.round((1 - estimates.safetyFactor) * 5),
    };

    onApply(mappedData);
  };

  return (
    <div className="bg-cyber-dark border border-cyber-cyan/30 rounded-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-purple/20 via-cyber-cyan/10 to-transparent p-4 border-b border-cyber-cyan/30 flex justify-between items-center">
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
              Extracts variations to fill all protocols automatically
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-black/40 rounded-sm p-1 border border-cyber-gray">
                <button 
                    onClick={() => setEngineMode('heuristic')}
                    className={`px-3 py-1 text-[10px] uppercase font-bold rounded-sm transition-colors flex items-center gap-1 ${engineMode === 'heuristic' ? 'bg-cyber-cyan text-black' : 'text-slate-500 hover:text-white'}`}
                >
                    <Cpu size={10} /> Heuristic
                </button>
                <button 
                    onClick={() => setEngineMode('neural')}
                    className={`px-3 py-1 text-[10px] uppercase font-bold rounded-sm transition-colors flex items-center gap-1 ${engineMode === 'neural' ? 'bg-cyber-purple text-white' : 'text-slate-500 hover:text-white'}`}
                >
                    <Brain size={10} /> Neural
                </button>
            </div>
            {onClose && (
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
            </button>
            )}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="p-4 border-b border-cyber-gray/30">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your prompt here... The engine will analyze it and calculate input values for DLA, PRICE, and VECTOR methods."
          className="w-full h-32 bg-black/60 border border-cyber-gray/30 rounded-sm p-4 
                     font-mono text-sm text-white placeholder:text-slate-600
                     focus:border-cyber-cyan/50 focus:outline-none resize-none mb-3"
        />

        <button
          onClick={runSmartAnalysis}
          disabled={!prompt.trim() || isAnalyzing}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 
                      font-mono text-sm font-bold uppercase tracking-wider rounded-sm
                      transition-all duration-300
                      ${!prompt.trim() || isAnalyzing
                        ? 'bg-cyber-gray/20 text-slate-600 cursor-not-allowed'
                        : engineMode === 'neural' 
                            ? 'bg-gradient-to-r from-cyber-purple/40 to-cyber-purple/20 text-white border border-cyber-purple/50'
                            : 'bg-gradient-to-r from-cyber-cyan/30 to-cyber-cyan/10 text-white border border-cyber-cyan/50'
                      } hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {engineMode === 'neural' ? 'Running Deep Analysis...' : 'Extracting Variables...'}
            </>
          ) : (
            <>
              {engineMode === 'neural' ? <Brain size={16} /> : <Zap size={16} />}
              {engineMode === 'neural' ? 'Run Neural Analysis' : 'Run Fast Heuristic'}
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && estimates && (
        <div className="p-4 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <div className="bg-black/40 p-2 border border-cyber-gray/30 rounded-sm text-center">
                <div className="text-[10px] text-slate-500 uppercase">Type</div>
                <div className="text-xs font-bold text-white uppercase">{analysis.taskType}</div>
             </div>
             <div className="bg-black/40 p-2 border border-cyber-gray/30 rounded-sm text-center">
                <div className="text-[10px] text-slate-500 uppercase">Complexity</div>
                <div className="text-xs font-bold text-cyber-cyan uppercase">{analysis.complexityLevel}</div>
             </div>
             <div className="bg-black/40 p-2 border border-cyber-gray/30 rounded-sm text-center">
                <div className="text-[10px] text-slate-500 uppercase">Est. Output</div>
                <div className="text-xs font-bold text-white uppercase">{analysis.estimatedOutputLength}</div>
             </div>
             <div className="bg-black/40 p-2 border border-cyber-gray/30 rounded-sm text-center">
                <div className="text-[10px] text-slate-500 uppercase">Constraints</div>
                <div className="text-xs font-bold text-cyber-green uppercase">{analysis.hardConstraintCount} Hard</div>
             </div>
          </div>

          <div className="bg-black/40 border border-cyber-orange/30 rounded-sm overflow-hidden">
            <button
              onClick={() => setShowAdjustments(!showAdjustments)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-cyber-orange" />
                <span className="text-xs font-bold uppercase text-cyber-orange">
                  Extracted Estimates (Click to Edit)
                </span>
              </div>
              <ChevronDown size={14} className={`text-cyber-orange transition-transform ${showAdjustments ? 'rotate-180' : ''}`} />
            </button>
            
            {showAdjustments && (
              <div className="p-4 border-t border-cyber-gray/30 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Wage ($/hr)', key: 'hourlyWage' },
                  { label: 'Out Chars', key: 'estimatedOutputChars' },
                  { label: 'Vol/Yr', key: 'yearlyVolume' },
                  { label: 'Reliability', key: 'reliabilityScore', isPct: true },
                  { label: 'Unit Weight', key: 'parameterWeight' },
                ].map((field: any) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase">{field.label}</label>
                    <input
                      type="number"
                      value={field.isPct ? ((estimates as any)[field.key] * 100).toFixed(0) : (estimates as any)[field.key]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEstimates(prev => prev ? { ...prev, [field.key]: field.isPct ? val/100 : val } : null);
                      }}
                      className="w-full bg-black border border-cyber-gray/30 rounded-sm px-2 py-1 text-white text-xs font-mono focus:border-cyber-cyan/50 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {(() => {
                const dla = calculateDLA();
                const price = calculatePRICE();
                const vector = calculateVECTOR();
                if (!dla || !price || !vector) return null;
                return (
                  <>
                    <div className="p-3 bg-cyber-dark border border-cyber-green/30 rounded-sm">
                      <div className="flex items-center gap-2 mb-1 text-cyber-green">
                        <DollarSign size={14} /> <span className="text-[10px] font-bold uppercase">DLA Net</span>
                      </div>
                      <div className="text-xl font-bold text-white">${dla.netSavings}</div>
                    </div>
                    <div className="p-3 bg-cyber-dark border border-cyber-cyan/30 rounded-sm">
                      <div className="flex items-center gap-2 mb-1 text-cyber-cyan">
                        <Tag size={14} /> <span className="text-[10px] font-bold uppercase">Scaled TAV</span>
                      </div>
                      <div className="text-xl font-bold text-white">${price.tav}</div>
                    </div>
                    <div className="p-3 bg-cyber-dark border border-cyber-red/30 rounded-sm">
                      <div className="flex items-center gap-2 mb-1 text-cyber-red">
                        <GitBranch size={14} /> <span className="text-[10px] font-bold uppercase">Q-Score</span>
                      </div>
                      <div className="text-xl font-bold text-white">{vector.qScore}</div>
                    </div>
                  </>
                );
             })()}
          </div>

          <button 
             onClick={handleApplyValues}
             className="w-full py-4 bg-gradient-to-r from-cyber-green to-cyber-cyan text-black font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all rounded-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Inject Data Into Terminal
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartAnalyzer;
