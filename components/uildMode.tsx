
import React, { useState } from 'react';
import { X, Cpu, Zap, Brain, Search, Send } from 'lucide-react';
import { APIKeys, AIProvider } from '../types';

interface BuildModeProps {
  onClose: () => void;
  onSendToAudit: (prompt: string) => void;
  apiKeys: APIKeys;
  activeProvider: AIProvider;
}

type SimMode = 'deep_reasoning' | 'grounding' | 'fast';

const TEMPLATES = [
  { id: 'CRISIS_COMMS', name: 'Crisis Communications', prompt: 'Generate a crisis management protocol for a Fortune 500 company facing a data breach...' },
  { id: 'SUPPLY_CHAIN', name: 'Supply Chain', prompt: 'Generate a supply chain monitoring protocol for real-time disruption detection...' },
  { id: 'FINANCIAL', name: 'Financial Analysis', prompt: 'Generate a financial analysis protocol for portfolio risk assessment...' },
];

const SIM_MODES: { id: SimMode; name: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'deep_reasoning', name: 'DEEP SIMULATION', icon: <Brain size={16} />, desc: 'Gemini 3 Pro + 32k Thinking' },
  { id: 'grounding', name: 'LIVE GROUNDING', icon: <Search size={16} />, desc: 'Gemini 2.5 Flash + Google Search' },
  { id: 'fast', name: 'RAPID PROTOCOL', icon: <Zap size={16} />, desc: 'Flash-Lite for quick drafts' },
];

const SYSTEM_INSTRUCTION = `You are EPSE (Enterprise Protocol Simulation Engine). 
Generate HIGH-QUALITY, production-ready enterprise prompts. 

Every prompt you generate MUST include these structured sections:
1. [ROLE]: Define the AI's professional identity.
2. [CONTEXT]: Describe the operational environment.
3. [OBJECTIVE]: State the goal clearly.
4. [CONSTRAINTS]: List at least 3 NEGATIVE constraints (e.g., 'Do NOT include X').
5. [OUTPUT_FORMAT]: Explicitly define the format (e.g., 'Markdown table', 'JSON compliant with this schema', 'Executive Summary').
6. [ERROR_HANDLING]: Instructions on what to do if input is invalid.

Focus on ELIMINATING AMBIGUITY and maximizing GOAL CLARITY.`;

const BuildMode: React.FC<BuildModeProps> = ({ onClose, onSendToAudit, apiKeys, activeProvider }) => {
  const [input, setInput] = useState('');
  const [simMode, setSimMode] = useState<SimMode>('deep_reasoning');
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!input.trim()) return;
    
    const apiKey = apiKeys[activeProvider];
    if (!apiKey) {
      setError(`No API key configured for ${activeProvider}. Please set it in Neural Link settings.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      let modelId = 'gemini-3-flash-preview';
      let config: any = { systemInstruction: SYSTEM_INSTRUCTION };

      if (simMode === 'deep_reasoning') {
        modelId = 'gemini-3-pro-preview';
        config.thinkingConfig = { thinkingBudget: 32768 };
      } else if (simMode === 'grounding') {
        config.tools = [{ googleSearch: {} }];
      } else if (simMode === 'fast') {
        modelId = 'gemini-flash-lite-latest';
      }

      const response = await ai.models.generateContent({
        model: modelId,
        contents: input,
        config,
      });

      setOutput(response.text || 'No response generated.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cyber-dark border border-cyber-gray rounded-sm flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-gray bg-cyber-black/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/50 rounded-sm flex items-center justify-center">
            <Cpu className="text-amber-400" size={16} />
          </div>
          <div>
            <h3 className="text-white font-mono font-bold uppercase tracking-wider text-sm">
              Protocol Builder
            </h3>
            <p className="text-[10px] text-slate-500">EPSE // High-Clarity Prompt Generation</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-cyber-cyan uppercase tracking-widest font-bold mb-2 block">
                Executive Protocol Requirements
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-48 bg-black/60 border border-cyber-gray rounded-sm p-3 text-sm text-white font-mono resize-none focus:outline-none focus:border-cyber-cyan transition"
                placeholder="State the core intent. The builder will add constraints and output formats to ensure high clarity..."
              />
            </div>

            {/* Templates */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 block">
                High-Value Blueprints
              </label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setInput(t.prompt)}
                    className="text-[10px] px-3 py-1.5 bg-cyber-gray/30 border border-cyber-gray hover:border-amber-500/50 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 rounded-sm transition"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation Mode */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 block">
                Generation Protocol
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SIM_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSimMode(mode.id)}
                    className={`flex flex-col items-center p-3 border rounded-sm transition ${
                      simMode === mode.id
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-black/40 border-cyber-gray text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {mode.icon}
                    <span className="text-[9px] font-bold mt-1">{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={!input.trim() || isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold font-mono uppercase tracking-wider rounded-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "ENGINEERING PROMPT..." : "GENERATE PROTOCOL"}
            </button>
          </div>

          {/* Output Panel */}
          <div className="space-y-4">
            <label className="text-[10px] text-cyber-cyan uppercase tracking-widest font-bold mb-2 block">
              Architected Prompt Output
            </label>
            
            <div className="bg-black/60 border border-cyber-gray rounded-sm min-h-[300px] max-h-[400px] overflow-y-auto">
              {output && (
                <div className="p-4 text-sm text-slate-300 font-mono whitespace-pre-wrap">
                  {output}
                </div>
              )}
              {isLoading && (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {output && (
              <button
                onClick={() => onSendToAudit(output)}
                className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-green-400 text-black font-bold font-mono uppercase tracking-wider rounded-sm hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Inject into Valuation Console →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildMode;
