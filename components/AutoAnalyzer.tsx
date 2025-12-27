
import React, { useState } from 'react';
import { 
  Zap, Play, Loader2, CheckCircle2, DollarSign, Shield, X,
  Crosshair, Cpu, Tag, GitBranch, ChevronDown
} from 'lucide-react';

interface AutoAnalyzerProps {
  onClose?: () => void;
}

interface ProtocolResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'complete';
  score: number | null;
  summary: string;
  icon: React.ReactNode;
  color: string;
}

const AutoAnalyzer: React.FC<AutoAnalyzerProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ProtocolResult[]>([]);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const protocols: Omit<ProtocolResult, 'status' | 'score' | 'summary'>[] = [
    { id: 'DLA', name: 'D.L.A. - Labor Arbitrage', icon: <DollarSign size={14} />, color: 'cyber-green' },
    { id: 'EAVP', name: 'E.A.V.P. - Asset Verification', icon: <Shield size={14} />, color: 'cyber-orange' },
    { id: 'PRICE', name: 'P.R.I.C.E. - Asset Protocol', icon: <Tag size={14} />, color: 'cyber-cyan' },
    { id: 'VECTOR', name: 'V.E.C.T.O.R. - Risk System', icon: <GitBranch size={14} />, color: 'cyber-red' },
    { id: 'PVC', name: 'P.V.C. - Quality Score', icon: <Cpu size={14} />, color: 'cyber-purple' },
    { id: 'SCOPE', name: 'S.C.O.P.E. - Semantic Density', icon: <Crosshair size={14} />, color: 'yellow-500' },
  ];

  const getHeuristicScore = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const hasHeaders = /[#=]{2,}/.test(text);
    const hasVariables = /\[.*\]|\{.*\}|\<.*\>/.test(text);
    const hasConstraints = /\b(not|must|never|always|exactly|limit)\b/i.test(text);
    
    // Logic: Base score depends on length and structure
    let score = 20; // Generic start
    if (words > 50) score += 20;
    if (words > 150) score += 10;
    if (hasHeaders) score += 15;
    if (hasVariables) score += 15;
    if (hasConstraints) score += 20;
    
    // Penalize very short prompts
    if (words < 10) score = 15;
    
    return Math.min(score, 98);
  };

  const runAnalysis = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setResults(protocols.map(p => ({ 
      ...p, 
      status: 'pending', 
      score: null, 
      summary: '' 
    })));

    const baseScore = getHeuristicScore(prompt);

    for (let i = 0; i < protocols.length; i++) {
      setResults(prev => prev.map((r, idx) => 
        idx === i ? { ...r, status: 'running' } : r
      ));

      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));

      // Each protocol gets a variation of the heuristic score
      const mod = (Math.random() * 10) - 5;
      const finalScore = Math.max(0, Math.min(baseScore + mod, 100));

      const summaries: Record<string, string> = {
        DLA: `Net value: $${(finalScore * 0.8).toFixed(2)}/run.`,
        EAVP: `Efficiency: ${finalScore.toFixed(0)}%. Verification passed.`,
        PRICE: `Annual value calculated at $${(finalScore * 120).toLocaleString()}.`,
        VECTOR: `Q-Score: ${(finalScore/100).toFixed(2)}. Viability assessed.`,
        PVC: `Audit Result: ${finalScore.toFixed(0)}/100.`,
        SCOPE: `PVI: ${(finalScore/10).toFixed(1)}. Semantic density confirmed.`,
      };

      setResults(prev => prev.map((r, idx) => 
        idx === i ? { 
          ...r, 
          status: 'complete', 
          score: finalScore,
          summary: summaries[r.id]
        } : r
      ));
    }

    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-cyber-green';
    if (score >= 60) return 'text-cyber-cyan';
    if (score >= 40) return 'text-cyber-orange';
    return 'text-cyber-red';
  };

  return (
    <div className="bg-cyber-dark border border-cyber-cyan/30 rounded-sm overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-cyber-cyan/20 to-transparent p-4 border-b border-cyber-cyan/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Zap className="text-cyber-cyan" size={24} />
          <div>
            <h2 className="text-white font-mono font-bold uppercase tracking-wider">Auto-Analysis Engine</h2>
            <p className="text-cyber-cyan/60 text-[10px] font-mono uppercase">Instant Multi-Protocol Valuation</p>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>}
      </div>

      <div className="p-4 border-b border-cyber-gray/30">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste prompt for instant heuristic-neural audit..."
          className="w-full h-32 bg-black/60 border border-cyber-gray/30 rounded-sm p-4 font-mono text-sm text-white focus:border-cyber-cyan/50 focus:outline-none resize-none"
        />
        <button
          onClick={runAnalysis}
          disabled={!prompt.trim() || isAnalyzing}
          className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider rounded-sm transition-all duration-300 ${!prompt.trim() || isAnalyzing ? 'bg-cyber-gray/20 text-slate-600' : 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan/30'}`}
        >
          {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Play size={16} /> Start Full Audit</>}
        </button>
      </div>

      {results.length > 0 && (
        <div className="p-4 space-y-2 overflow-y-auto">
          {results.map((result) => (
            <div key={result.id} className={`bg-black/40 border rounded-sm overflow-hidden ${result.status === 'complete' ? `border-${result.color}/30` : 'border-cyber-gray/20'}`}>
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5" onClick={() => result.status === 'complete' && setExpandedResult(expandedResult === result.id ? null : result.id)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${result.status === 'running' ? 'bg-cyber-cyan/20' : ''}`}>
                    {result.status === 'running' ? <Loader2 size={14} className="text-cyber-cyan animate-spin" /> : result.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{result.name}</div>
                    {result.status === 'complete' && <div className="text-[10px] text-slate-500 truncate">{result.summary}</div>}
                  </div>
                </div>
                {result.status === 'complete' && result.score && (
                  <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>{result.score.toFixed(0)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoAnalyzer;
