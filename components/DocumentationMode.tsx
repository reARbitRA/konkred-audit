
// components/DocumentationMode.tsx

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  X, FileText, Copy, Check, RefreshCw, Download,
  AlertCircle, Clock, Sparkles, ChevronDown, Eye,
  Code, BookOpen, Zap, Layers, Cpu, Printer
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { APIKeys, AIProvider } from '../types';
import { DOCUMENTATION_TEMPLATE, populateTemplate } from '../constants';
import AssetDocument from './AssetDocument';

// =============================================================
// TYPES
// =============================================================

interface DocumentationModeProps {
  onClose: () => void;
  onAuditPrompt: (prompt: string) => void;
  apiKeys: APIKeys;
  activeProvider: AIProvider;
  initialPrompt?: string;
}

export interface DocumentationData {
  PROMPT_TITLE: string;
  USE_CASE: string;
  BEST_FOR: string;
  DIFFICULTY: string;
  TIME_SAVED: string;
  PROMPT_DOES: string;
  INDUSTRIES: { name: string; use: string }[];
  INPUTS: { name: string; desc: string; ex: string }[];
  OUTPUT_FORMAT: string;
  OUTPUT_ELEMENTS: string[];
  LIMITATIONS: string[];
  // New Premium Fields
  REFINED_PROMPT: string;
  SIMULATION: string;
  OPTIMIZATION_NOTES: string;
}

// =============================================================
// CONSTANTS
// =============================================================

const ANALYSIS_OPTIMIZATION_SYSTEM_PROMPT = `You are the Lead Architect of the KONKRED Asset Factory. 
Your goal is to transform a raw prompt into a "Premium Enterprise Asset".

Perform 2 distinct cognitive tasks:

1. **ANALYSIS**: Extract metadata (Inputs, Logic, Limitations).
2. **OPTIMIZATION (V2.0)**: Rewrite the prompt using elite Prompt Engineering techniques (Persona, Chain-of-Thought, Delimiters, XML tagging). The V2.0 prompt MUST be superior to the original.

Return a JSON object with EXACTLY this structure:
{
  "PROMPT_TITLE": "Clear, descriptive title (e.g., 'Enterprise Contract Analyzer')",
  "USE_CASE": "Primary use case in 5-10 words",
  "BEST_FOR": "Target audience (e.g., 'Legal Operations')",
  "DIFFICULTY": "Beginner | Intermediate | Advanced",
  "TIME_SAVED": "Estimated time saved (e.g., '2 hours/run')",
  "PROMPT_DOES": "2-3 sentence description of utility",
  "INDUSTRIES": [
    {"name": "Industry 1", "use": "Specific application"},
    {"name": "Industry 2", "use": "Specific application"}
  ],
  "INPUTS": [
    {"name": "[VAR_NAME]", "desc": "What to enter", "ex": "Example value"}
  ],
  "OUTPUT_FORMAT": "Format description (e.g., Markdown Table, JSON)",
  "OUTPUT_ELEMENTS": ["Element 1", "Element 2"],
  "LIMITATIONS": ["Caveat 1", "Caveat 2"],
  "REFINED_PROMPT": "The complete, optimized V2.0 prompt text...",
  "OPTIMIZATION_NOTES": "1 sentence on what was improved (e.g., 'Added CoT and XML schema')"
}

IMPORTANT:
- If original prompt is weak, the REFINED_PROMPT must fix it.
- Return ONLY valid JSON.
`;


const EXAMPLE_PROMPTS = [
  {
    id: 'contract',
    name: 'Contract Analyzer',
    prompt: `You are a senior legal analyst. Analyze this contract for risks.`
  },
  {
    id: 'marketing',
    name: 'Campaign Strategy',
    prompt: `Create a marketing campaign for a new coffee brand targeting Gen Z.`
  },
];

// =============================================================
// COMPONENT
// =============================================================

const DocumentationMode: React.FC<DocumentationModeProps> = ({ 
  onClose, 
  onAuditPrompt, 
  apiKeys, 
  activeProvider,
  initialPrompt = ''
}) => {
  // State
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [docData, setDocData] = useState<DocumentationData | null>(null); // Store parsed JSON
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null); // Store Markdown
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Update input when initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // Generate documentation (Re-architected to a 2-step process)
  const handleGenerate = async () => {
    if (!inputPrompt.trim()) {
      setError('Please enter a prompt to document.');
      return;
    }

    const apiKey = apiKeys['GEMINI'] || apiKeys[activeProvider];
    if (!apiKey) {
      setError(`No valid API key found. Please configure Google Gemini in Neural Link settings.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedDoc(null);
    setDocData(null);
    const startTime = Date.now();

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-3-flash-preview';

      // === STEP 1: ANALYSIS & OPTIMIZATION ===
      const analysisResponse = await ai.models.generateContent({
        model: model, 
        contents: `Process this raw prompt:\n\n${inputPrompt}`,
        config: {
          systemInstruction: ANALYSIS_OPTIMIZATION_SYSTEM_PROMPT,
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const analysisJsonText = analysisResponse.text || '{}';
      let analysisData: Omit<DocumentationData, 'SIMULATION'>;
      try {
        const cleanJson = analysisJsonText.replace(/```json\n?|\n?```/g, '').trim();
        analysisData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error (Step 1 - Analysis):', parseError, analysisJsonText);
        throw new Error('Failed to parse AI analysis response. The model returned invalid JSON.');
      }

      if (!analysisData.REFINED_PROMPT) {
          throw new Error('AI failed to generate an optimized V2.0 prompt during the analysis step.');
      }

      // === STEP 2: SIMULATION ===
      const simulationResponse = await ai.models.generateContent({
          model: model,
          contents: analysisData.REFINED_PROMPT,
          config: {
              temperature: 0.5,
          }
      });

      const simulationText = simulationResponse.text || '[Simulation failed to generate output.]';

      // === STEP 3: COMBINE & RENDER ===
      const finalData: DocumentationData = {
          ...analysisData,
          SIMULATION: simulationText,
      };
      
      setDocData(finalData);
      const documentation = populateTemplate(DOCUMENTATION_TEMPLATE, finalData, inputPrompt);
      setGeneratedDoc(documentation);
      setGenerationTime(Date.now() - startTime);

    } catch (err: any) {
      console.error('Generation error:', err);
      if (err.message?.includes('Rpc failed')) {
        setError('Connection interrupted (RPC/XHR). The model service may be overloaded. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred during asset generation.');
      }
    } finally {
      setIsGenerating(false);
    }
  };


  // Copy to clipboard
  const handleCopy = async () => {
    if (generatedDoc) {
      await navigator.clipboard.writeText(generatedDoc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate PDF Asset
  const handleGeneratePDF = async () => {
    if (!docData) return;
    setIsPdfGenerating(true);

    try {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        const root = ReactDOM.createRoot(container);
        root.render(<AssetDocument data={docData} originalPrompt={inputPrompt} />);

        // Wait for render and fonts
        await new Promise(resolve => setTimeout(resolve, 2000));

        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const pageElements = container.querySelectorAll('[id^="pdf-page-"]');
        
        for (let i = 0; i < pageElements.length; i++) {
            const pageElement = pageElements[i] as HTMLElement;
            // @ts-ignore
            const canvas = await window.html2canvas(pageElement, {
                scale: 2, // Higher resolution for better quality
                useCORS: true,
                backgroundColor: '#000000',
            });
            const imgData = canvas.toDataURL('image/png');

            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save(`KONKRED-ASSET-${docData.PROMPT_TITLE.replace(/\s+/g, '_')}.pdf`);

        root.unmount();
        document.body.removeChild(container);

    } catch (e) {
        console.error("PDF Generation Error", e);
        setError("PDF Generation failed. Please try again.");
    } finally {
        setIsPdfGenerating(false);
    }
  };

  // Load example
  const loadExample = (prompt: string) => {
    setInputPrompt(prompt);
    setShowExamples(false);
    setGeneratedDoc(null);
    setDocData(null);
    setError(null);
  };

  // Reset
  const handleReset = () => {
    setInputPrompt('');
    setGeneratedDoc(null);
    setDocData(null);
    setError(null);
    setGenerationTime(null);
  };

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (md: string) => {
    return md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-6 mb-2 border-b border-cyber-gray/30 pb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-cyber-cyan mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-4 mb-6 uppercase tracking-wider">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      // Code blocks (Pre-process specific blocks)
      .replace(/```(xml|text|json)\n([\s\S]*?)```/g, '<div class="relative group my-4"><div class="absolute right-2 top-2 text-[9px] text-slate-500 uppercase font-bold">$1</div><pre class="bg-black border border-cyber-gray/50 rounded-sm p-4 overflow-x-auto text-xs font-mono text-cyber-green/90"><code>$2</code></pre></div>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-cyber-gray/50 px-1.5 py-0.5 rounded text-amber-400 text-xs font-mono">$1</code>')
      // Tables
      .replace(/\|(.+)\|/g, (match) => {
        if (match.includes('---')) return '';
        const cells = match.split('|').filter(c => c.trim().length > 0 || c === ' ');
        // Check if header row by context (heuristic: usually first in block) - simplified here
        return `<div class="flex border-b border-cyber-gray/20 hover:bg-white/5 transition-colors">${cells.map(c => `<div class="flex-1 px-3 py-2 text-xs border-r border-cyber-gray/20 last:border-0">${c.trim()}</div>`).join('')}</div>`;
      })
      // List items
      .replace(/^- (.*$)/gim, '<div class="flex gap-2 mb-1 ml-2"><span class="text-cyber-cyan">•</span><span class="text-slate-300 text-sm">$1</span></div>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<div class="border-l-2 border-purple-500 pl-4 py-2 my-4 bg-purple-500/10 text-xs text-slate-300 italic">$1</div>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="border-cyber-gray/30 my-8" />')
      // Line breaks
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="bg-cyber-dark border border-purple-500/30 rounded-sm flex flex-col h-full max-h-[90vh] overflow-hidden">
      
      {/* ============ HEADER ============ */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-cyber-gray bg-gradient-to-r from-purple-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/50 rounded-sm flex items-center justify-center">
            <Layers className="text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-white font-mono font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              Asset Factory
              <span className="text-[9px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                PREMIUM
              </span>
            </h3>
            <p className="text-[10px] text-slate-500">
              Transform raw text into verified enterprise assets (Documentation + V2 Optimization)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {inputPrompt && (
            <button 
              onClick={handleReset}
              className="text-[10px] text-slate-500 hover:text-white transition px-2 py-1 hover:bg-white/5 rounded flex items-center gap-1"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          )}
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition p-2 hover:bg-white/5 rounded"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ============ CONTENT ============ */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full divide-y lg:divide-y-0 lg:divide-x divide-cyber-gray">
          
          {/* ======== LEFT: INPUT PANEL ======== */}
          <div className="p-4 space-y-4 overflow-y-auto">
            
            {/* Prompt Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] text-cyber-cyan uppercase tracking-widest font-bold flex items-center gap-2">
                  <FileText size={12} />
                  Raw Protocol Input
                </label>
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="text-[10px] text-slate-500 hover:text-purple-400 transition flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  Load Blueprint
                  <ChevronDown size={10} className={`transition-transform ${showExamples ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Example Prompts */}
              {showExamples && (
                <div className="mb-3 bg-black/50 border border-cyber-gray rounded-sm p-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {EXAMPLE_PROMPTS.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => loadExample(ex.prompt)}
                      className="w-full text-left p-2 hover:bg-purple-500/10 rounded transition group"
                    >
                      <span className="text-xs text-white group-hover:text-purple-400 transition">
                        {ex.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                className="w-full h-64 bg-black/60 border border-cyber-gray rounded-sm p-3 text-sm text-white font-mono resize-none focus:outline-none focus:border-purple-500/50 transition placeholder:text-slate-600"
                placeholder={`Paste your raw prompt here...

The Asset Factory will:
1. Analyze structure & extracting inputs
2. ENGINEER a superior V2.0 version
3. RUN a simulation to prove value
4. GENERATE a PDF Asset Pack`}
              />
              
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600">
                <span>{inputPrompt.length.toLocaleString()} characters</span>
                <span>~{Math.ceil(inputPrompt.length / 4).toLocaleString()} tokens</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!inputPrompt.trim() || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold font-mono uppercase tracking-wider rounded-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-purple-400/50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Engineering Asset... (Deep Think)
                </>
              ) : (
                <>
                  <Cpu size={16} />
                  Initialize Factory Protocol
                </>
              )}
            </button>

            {/* Audit Button */}
            {inputPrompt.trim() && (
              <button
                onClick={() => onAuditPrompt(inputPrompt)}
                className="w-full py-2.5 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cyber-cyan/20 transition flex items-center justify-center gap-2"
              >
                <Zap size={14} />
                Audit This Prompt in KONKRED
              </button>
            )}

            {/* Info */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-sm p-3">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <strong className="text-purple-400">Premium Output:</strong> This engine generates a comprehensive 4-page asset pack including the optimized prompt code, simulation proof, and technical specifications.
              </p>
            </div>
          </div>

          {/* ======== RIGHT: OUTPUT PANEL ======== */}
          <div className="p-4 flex flex-col overflow-hidden bg-black/20">
            <div className="flex-shrink-0 flex items-center justify-between mb-2">
              <label className="text-[10px] text-cyber-cyan uppercase tracking-widest font-bold flex items-center gap-2">
                <BookOpen size={12} />
                Asset Preview
              </label>
              {generatedDoc && (
                <div className="flex items-center gap-2">
                  
                  {/* View Toggle */}
                  <div className="flex items-center bg-cyber-gray/30 rounded-sm overflow-hidden border border-cyber-gray/50">
                    <button
                      onClick={() => setViewMode('preview')}
                      className={`text-[9px] px-3 py-1.5 flex items-center gap-1 transition font-bold uppercase tracking-wider ${
                        viewMode === 'preview' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <Eye size={10} />
                      Render
                    </button>
                    <div className="w-px h-3 bg-cyber-gray/50"></div>
                    <button
                      onClick={() => setViewMode('raw')}
                      className={`text-[9px] px-3 py-1.5 flex items-center gap-1 transition font-bold uppercase tracking-wider ${
                        viewMode === 'raw' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <Code size={10} />
                      Code
                    </button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-slate-500 hover:text-white transition flex items-center gap-1 px-3 py-1.5 bg-cyber-gray/30 border border-cyber-gray/50 rounded-sm hover:bg-cyber-gray/50"
                  >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>

                  <button
                    onClick={handleGeneratePDF}
                    disabled={isPdfGenerating}
                    className="text-[10px] text-black font-bold uppercase tracking-wide transition flex items-center gap-2 px-4 py-1.5 bg-cyber-cyan border border-cyber-cyan hover:bg-cyan-400 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPdfGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Printer size={12} />}
                    Print Asset
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-black/60 border border-cyber-gray rounded-sm overflow-hidden flex flex-col min-h-[300px] relative">
              
              {/* Empty State */}
              {!generatedDoc && !isGenerating && !error && (
                <div className="flex-1 flex items-center justify-center text-slate-600 p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 border border-dashed border-cyber-gray rounded-full flex items-center justify-center">
                        <BookOpen size={32} className="opacity-20" />
                    </div>
                    <p className="text-sm mb-2 text-slate-500 font-bold uppercase tracking-wider">Factory Idle</p>
                    <p className="text-[10px] text-slate-700 max-w-xs mx-auto">
                      Initialize the protocol to generate your Premium Asset Pack.
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="flex-1 flex items-center justify-center text-purple-400 p-8">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 border-2 border-purple-500/20 rounded-full mx-auto" />
                      <div className="w-24 h-24 border-2 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Sparkles size={32} className="text-purple-400 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Running Simulation...</p>
                    <div className="text-[10px] text-slate-500 mt-2 space-y-1 font-mono">
                        <p>> Analyzing constraints...</p>
                        <p>> Engineering V2.0 Protocol...</p>
                        <p>> Verifying output quality...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 text-red-400 flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle size={32} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm mb-1 uppercase tracking-wider">Protocol Failure</p>
                      <p className="text-xs opacity-80 leading-relaxed max-w-xs">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Documentation */}
              {generatedDoc && (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* Success Bar */}
                  <div className="flex-shrink-0 sticky top-0 bg-cyber-dark/95 backdrop-blur-sm border-b border-cyber-gray px-4 py-2 flex items-center justify-between z-10">
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                      Asset Compiled in {(generationTime! / 1000).toFixed(1)}s
                    </span>
                    <span className="text-[9px] text-green-400 flex items-center gap-1 font-bold uppercase tracking-wider">
                      <Check size={10} />
                      Verified
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {viewMode === 'raw' ? (
                      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {generatedDoc}
                      </pre>
                    ) : (
                      <div 
                        className="prose prose-invert prose-sm max-w-none prose-headings:font-mono prose-p:text-slate-400 prose-li:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedDoc) }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <div className="flex-shrink-0 p-3 border-t border-cyber-gray bg-cyber-black/50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] text-slate-600">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Asset Factory v2.0
          </span>
          <span className="text-cyber-gray">|</span>
          <span>Engine: {activeProvider}</span>
        </div>
        <div className="text-[10px] text-slate-600">
          Press <kbd className="bg-cyber-gray/50 px-1.5 py-0.5 rounded mx-1 text-slate-400">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default DocumentationMode;
