
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// Components
import AnalysisForm from './components/AnalysisForm';
import AnalysisResult from './components/AnalysisResult';
import TerminalLoader from './components/TerminalLoader';
import MethodLibrary from './components/library/MethodLibrary';
import SmartAnalyzer from './components/SmartAnalyzer';
import AutoAnalyzer from './components/AutoAnalyzer';
import DocumentationMode from './components/DocumentationMode';
import Certificate from './cert/react/Certificate';
import KonkredLoader from './components/KonkredLoader';

// Services
import { orchestrateAnalysis } from './services/gemini';

// Types
import { 
  ValuationRequest, 
  ValuationReport, 
  ValuationMethod, 
  APIKeys, 
  AIProvider, 
  ProviderConfig 
} from './types';

// Icons
import { 
  Box, Terminal, Cpu, Activity, X, Linkedin, Book, Sparkles, 
  Award, Loader2, Settings, Key, Zap, Brain, Globe, Server,
  BookOpen, ChevronRight, ChevronDown, Shield, Layers, BarChart3, 
  Fingerprint, Radio, Wifi, Database, Lock, Unlock,
  HelpCircle, Command, Clock, CheckCircle2,
  AlertTriangle, RefreshCw, ArrowRight
} from 'lucide-react';

// =============================================================
// PROVIDER CONFIGURATION
// =============================================================

const PROVIDERS: ProviderConfig[] = [
  // Updated Gemini model to recommended gemini-3-flash-preview
  { id: 'GEMINI', name: 'Google Gemini', model: 'gemini-3-flash-preview', icon: 'Brain', color: 'cyan' },
  { id: 'GROQ', name: 'Groq Cloud', model: 'Llama 3.3 70B', icon: 'Zap', color: 'orange' },
  { id: 'CEREBRAS', name: 'Cerebras Inference', model: 'Llama 3.1 70B', icon: 'Cpu', color: 'green' },
  { id: 'SAMBANOVA', name: 'SambaNova Systems', model: 'Llama 3.1 70B', icon: 'Server', color: 'purple' },
  { id: 'OPENROUTER', name: 'OpenRouter', model: 'Auto / Llama 3', icon: 'Globe', color: 'blue' },
];

// =============================================================
// DEFAULT FORM STATE
// =============================================================

const DEFAULT_FORM_DATA: ValuationRequest = {
  inputPrompt: '',
  promptTitle: '',
  // DLA Fields
  outputCharCount: 5000,
  apiLatencySeconds: 12.5,
  editSessionSeconds: 180,
  apiCostUsd: 0.04,
  humanWpm: 40,
  humanReadingWpm: 250,
  hourlyWage: 60, // Updated to 60 to match DLA protocol standard
  // EAVP Fields
  outputChars: 4000,
  userWPM: 50,
  editTime: 3,
  regenerations: 1,
  marketRate: 90,
  // PRICE Fields
  humanTimeMinutes: 60,
  humanHourlyRate: 50,
  reviewTimeMinutes: 10,
  tokenCost: 0.10,
  reliability: 0.9,
  yearlyVolume: 250,
  useCase: 'SOP',
  // Fix: Initialize missing PRICE protocol fields.
  valuedParameter: 'Core Unit',
  parameterWeight: 1.0,
  // VECTOR Fields
  score_constraints: 4,
  score_context: 3,
  score_feasibility: 3,
  score_safety: 0,
  human_hourly_rate: 100,
  time_saved_minutes: 45,
  annual_volume: 200,
  revenue_lift_per_run: 0,
  api_cost_per_run: 0.50,
};

// =============================================================
// TYPES
// =============================================================

type AppView = 'home' | 'audit' | 'document' | 'results';
type ModalType = 'settings' | 'library' | 'smart' | 'auto' | 'help' | null;

interface SystemStatus {
  neural: 'online' | 'offline' | 'connecting';
  protocols: number;
  uptime: number;
  lastSync: Date;
}

interface AppPreferences {
  soundEnabled: boolean;
  crtEffect: boolean;
  compactMode: boolean;
  autoSave: boolean;
}

// =============================================================
// CUSTOM HOOKS
// =============================================================

const useSystemStatus = (activeProvider: AIProvider, apiKeys: APIKeys): SystemStatus => {
  const [uptime, setUptime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const neural = useMemo(() => {
    if (!apiKeys[activeProvider]) return 'offline';
    return 'online';
  }, [activeProvider, apiKeys]);

  return {
    neural,
    protocols: 6,
    uptime,
    lastSync: new Date(),
  };
};

const useKeyboardShortcuts = (handlers: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handlers.openSettings?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        handlers.openDocument?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handlers.runAnalysis?.();
      }
      if (e.key === 'Escape') {
        handlers.closeModal?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};

// =============================================================
// UTILITY COMPONENTS
// =============================================================

const StatusIndicator: React.FC<{ status: 'online' | 'offline' | 'connecting'; label: string }> = ({ status, label }) => {
  const colors = {
    online: 'bg-green-500 shadow-green-500/50',
    offline: 'bg-red-500 shadow-red-500/50',
    connecting: 'bg-yellow-500 shadow-yellow-500/50 animate-pulse',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full shadow-lg ${colors[status]}`} />
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
        {label}: <span className={status === 'online' ? 'text-green-400' : 'text-red-400'}>{status}</span>
      </span>
    </div>
  );
};

const CommandPalette: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onCommand: (cmd: string) => void;
}> = ({ isOpen, onClose, onCommand }) => {
  const [search, setSearch] = useState('');

  const commands = [
    { id: 'document', label: 'Generate Documentation', icon: <BookOpen size={14} />, shortcut: '⌘D' },
    { id: 'audit', label: 'Start New Audit', icon: <BarChart3 size={14} />, shortcut: '⌘N' },
    { id: 'settings', label: 'Neural Link Settings', icon: <Settings size={14} />, shortcut: '⌘K' },
    { id: 'library', label: 'Protocol Library', icon: <Book size={14} />, shortcut: '⌘L' },
    { id: 'smart', label: 'Smart Analyzer', icon: <Sparkles size={14} />, shortcut: '⌘S' },
    { id: 'auto', label: 'Auto-Analyze All', icon: <Zap size={14} />, shortcut: '⌘A' },
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-2xl shadow-cyber-cyan/10 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-cyber-gray">
          <Command size={16} className="text-cyber-cyan" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none"
            autoFocus
          />
          <kbd className="text-[10px] text-slate-600 bg-cyber-gray/50 px-2 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => { onCommand(cmd.id); onClose(); }}
              className="w-full flex items-center justify-between p-3 hover:bg-cyber-cyan/10 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500 group-hover:text-cyber-cyan transition">{cmd.icon}</span>
                <span className="text-sm text-white">{cmd.label}</span>
              </div>
              <kbd className="text-[10px] text-slate-600">{cmd.shortcut}</kbd>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Breadcrumb: React.FC<{ 
  view: AppView; 
  method?: ValuationMethod;
  onNavigate: (view: AppView) => void;
}> = ({ view, method, onNavigate }) => {
  const crumbs = [
    { id: 'home', label: 'Terminal', icon: <Terminal size={12} /> },
  ];

  if (view === 'audit' || view === 'results') {
    crumbs.push({ id: 'audit', label: 'Audit', icon: <BarChart3 size={12} /> });
  }
  if (view === 'document') {
    crumbs.push({ id: 'document', label: 'Document', icon: <BookOpen size={12} /> });
  }
  if (view === 'results' && method) {
    crumbs.push({ id: 'results', label: method, icon: <CheckCircle2 size={12} /> });
  }

  return (
    <div className="flex items-center gap-1 text-[10px] font-mono">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.id}>
          {i > 0 && <ChevronRight size={10} className="text-slate-600" />}
          <button
            onClick={() => onNavigate(crumb.id as AppView)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition ${
              i === crumbs.length - 1 
                ? 'text-cyber-cyan bg-cyber-cyan/10' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {crumb.icon}
            <span>{crumb.label}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

// =============================================================
// SETTINGS MODAL (NEURAL LINK)
// =============================================================

const NeuralLinkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  apiKeys: APIKeys;
  setApiKeys: (keys: APIKeys) => void;
  activeProvider: AIProvider;
  setActiveProvider: (provider: AIProvider) => void;
}> = ({ isOpen, onClose, apiKeys, setApiKeys, activeProvider, setActiveProvider }) => {
  
  const [testingProvider, setTestingProvider] = useState<AIProvider | null>(null);
  const [testResults, setTestResults] = useState<Record<AIProvider, 'success' | 'error' | null>>({
    GEMINI: null, GROQ: null, CEREBRAS: null, SAMBANOVA: null, OPENROUTER: null, HUGGINGFACE: null
  });

  const testConnection = async (provider: AIProvider) => {
    setTestingProvider(provider);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (apiKeys[provider]) {
        setTestResults(prev => ({ ...prev, [provider]: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, [provider]: 'error' }));
      }
    } catch {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
    }
    setTestingProvider(null);
  };

  const updateApiKey = (provider: AIProvider, value: string) => {
    setApiKeys({ ...apiKeys, [provider]: value });
    setTestResults(prev => ({ ...prev, [provider]: null }));
  };

  const getProviderIcon = (id: string) => {
    switch (id) {
      case 'GEMINI': return <Brain size={16} />;
      case 'GROQ': return <Zap size={16} />;
      case 'CEREBRAS': return <Cpu size={16} />;
      case 'SAMBANOVA': return <Server size={16} />;
      case 'OPENROUTER': return <Globe size={16} />;
      default: return <Database size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-cyber-dark border border-cyber-cyan/30 rounded-sm shadow-2xl shadow-cyber-cyan/10 overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-cyber-cyan/30 bg-gradient-to-r from-cyber-black to-cyber-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-sm flex items-center justify-center">
              <Fingerprint className="text-cyber-cyan" size={20} />
            </div>
            <div>
              <h3 className="text-white font-mono font-bold uppercase tracking-wider">Neural Link</h3>
              <p className="text-[10px] text-slate-500">AI Provider Configuration & Authentication</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition p-2 hover:bg-white/5 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div>
            <label className="flex items-center gap-2 text-[10px] text-cyber-cyan uppercase tracking-widest font-bold mb-4">
              <Radio size={12} />
              Active Inference Engine
            </label>
            <div className="relative group">
              <select
                value={activeProvider}
                onChange={(e) => setActiveProvider(e.target.value as AIProvider)}
                className="w-full bg-black/60 border border-cyber-gray rounded-sm py-3 pl-10 pr-10 text-xs font-mono text-white appearance-none focus:border-cyber-cyan focus:outline-none transition-all cursor-pointer hover:border-slate-500"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-cyber-black text-white">
                    {p.name} — {p.model}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-cyan pointer-events-none">
                {getProviderIcon(activeProvider)}
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-white transition-colors">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] text-cyber-cyan uppercase tracking-widest font-bold mb-4">
              <Key size={12} />
              API Keys Configuration
            </label>
            <div className="space-y-3">
              {PROVIDERS.map(p => (
                <div key={p.id} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-500 uppercase">{p.name}</span>
                    {testResults[p.id] === 'success' && (
                      <span className="text-[9px] text-green-400 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Connected
                      </span>
                    )}
                    {testResults[p.id] === 'error' && (
                      <span className="text-[9px] text-red-400 flex items-center gap-1">
                        <AlertTriangle size={10} /> Failed
                      </span>
                    )}
                  </div>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                        {apiKeys[p.id] ? <Lock size={14} /> : <Unlock size={14} />}
                      </div>
                      <input 
                        type="password" 
                        value={apiKeys[p.id] || ''}
                        onChange={(e) => updateApiKey(p.id, e.target.value)}
                        placeholder={`Enter ${p.name} API Key...`}
                        className={`w-full bg-black/60 border rounded-sm py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          activeProvider === p.id 
                            ? 'border-cyber-cyan/50 focus:border-cyber-cyan' 
                            : 'border-cyber-gray focus:border-slate-500'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => testConnection(p.id)}
                      disabled={!apiKeys[p.id] || testingProvider === p.id}
                      className="px-4 py-2 bg-cyber-gray/30 border border-cyber-gray hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testingProvider === p.id ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Wifi size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyber-gray/10 border border-cyber-gray/30 rounded-sm p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-green-500 mt-0.5" size={16} />
              <div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-green-400">Security Notice:</strong> API keys are stored in local browser memory only 
                  and are never transmitted to any external server.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-cyber-gray/30 bg-cyber-black/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <Database size={12} />
            <span>{Object.values(apiKeys).filter(Boolean).length} / {PROVIDERS.length} providers configured</span>
          </div>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan text-xs font-mono uppercase tracking-wider hover:bg-cyber-cyan/20 transition-all rounded-sm"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// HOME VIEW
// =============================================================

const HomeView: React.FC<{
  onNavigate: (view: AppView) => void;
  systemStatus: SystemStatus;
}> = ({ onNavigate, systemStatus }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyber-cyan/30 bg-cyber-cyan/5 rounded-full text-cyber-cyan text-xs font-mono tracking-widest mb-8 backdrop-blur-sm">
        <Cpu size={12} className="animate-spin-slow" />
        <span>KAVM PROTOCOL v2.0 ONLINE</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">{systemStatus.protocols} PROTOCOLS LOADED</span>
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter font-mono leading-[0.9] text-center mb-6">
        <span className="block">QUANTIFY THE</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-orange-500 to-cyber-red animate-gradient-x">
          MACHINE INTELLIGENCE
        </span>
      </h1>

      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto text-center mb-12 leading-relaxed">
        Document your prompts professionally. Analyze their quality. Calculate their true financial value.
      </p>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full px-4">
        
        {/* Document Card */}
        <button
          onClick={() => onNavigate('document')}
          className="group relative p-8 bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 hover:border-purple-500/50 rounded-lg transition-all duration-500 text-left overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-300">
              <BookOpen className="text-purple-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              DOCUMENT
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Generate comprehensive documentation for your prompts automatically
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] px-2 py-1 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                AUTO-DOC
              </span>
              <span className="text-[10px] px-2 py-1 bg-pink-500/10 text-pink-400 rounded border border-pink-500/20">
                MARKETPLACE READY
              </span>
              <span className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                EXPORT MD
              </span>
            </div>
            <div className="flex items-center gap-2 mt-6 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
              <span className="text-sm font-mono">Generate Docs</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </button>

        {/* Audit Card */}
        <button
          onClick={() => onNavigate('audit')}
          className="group relative p-8 bg-gradient-to-br from-cyber-cyan/5 to-transparent border border-cyber-cyan/20 hover:border-cyber-cyan/50 rounded-lg transition-all duration-500 text-left overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-3xl group-hover:bg-cyber-cyan/20 transition-all duration-500" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyber-cyan/50 transition-all duration-300">
              <BarChart3 className="text-cyber-cyan" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
              AUDIT
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Analyze, value, and certify your prompts with 6 professional protocols
            </p>
            <div className="flex flex-wrap gap-2">
              {['DLA', 'PVC', 'SCOPE', 'EAVP', 'PRICE', 'VECTOR'].map(p => (
                <span key={p} className="text-[10px] px-2 py-1 bg-cyber-gray/50 text-slate-400 rounded border border-cyber-gray">
                  {p}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-6 text-cyber-cyan opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
              <span className="text-sm font-mono">Start Audit</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-8 mt-16 text-[10px] font-mono text-slate-600">
        <div className="flex items-center gap-2">
          <Layers size={12} />
          <span>6 PROTOCOLS</span>
        </div>
        <div className="w-px h-4 bg-cyber-gray" />
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>~30s ANALYSIS</span>
        </div>
        <div className="w-px h-4 bg-cyber-gray" />
        <div className="flex items-center gap-2">
          <Award size={12} />
          <span>CERTIFIED OUTPUT</span>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// MAIN APP COMPONENT
// =============================================================

interface KonkredTerminalProps {
  apiKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

const KonkredTerminal: React.FC<KonkredTerminalProps> = ({ apiKey, className = '', style = {} }) => {
  
  // Boot & View State
  const [isBooting, setIsBooting] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // API & Provider State
  const [apiKeys, setApiKeys] = useLocalStorage<APIKeys>('konkred-api-keys', {
    GEMINI: process.env.API_KEY || apiKey || '',
    GROQ: '',
    CEREBRAS: '',
    SAMBANOVA: '',
    OPENROUTER: '',
    HUGGINGFACE: '',
  });
  const [activeProvider, setActiveProvider] = useLocalStorage<AIProvider>('konkred-provider', 'GEMINI');

  // Form & Analysis State
  const [valuationMethod, setValuationMethod] = useState<ValuationMethod>('DLA');
  const [formData, setFormData] = useState<ValuationRequest>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ValuationReport | ValuationReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PDF State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Preferences
  const [preferences, setPreferences] = useLocalStorage<AppPreferences>('konkred-prefs', {
    soundEnabled: true,
    crtEffect: true,
    compactMode: false,
    autoSave: false,
  });

  // System Status
  const systemStatus = useSystemStatus(activeProvider, apiKeys);

  // =============================================================
  // HANDLERS
  // =============================================================

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const startTime = Date.now();
      const valuationReport = await orchestrateAnalysis(formData, valuationMethod, apiKeys, activeProvider);
      
      const elapsedTime = Date.now() - startTime;
      const minLoaderTime = (valuationMethod === 'ALL' || valuationMethod === 'CORE') ? 5000 : 2500;
      if (elapsedTime < minLoaderTime) {
        await new Promise(resolve => setTimeout(resolve, minLoaderTime - elapsedTime));
      }

      setReport(valuationReport);
      setCurrentView('results');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during valuation.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, valuationMethod, apiKeys, activeProvider]);

  const handleSmartApply = useCallback((extractedData: Partial<ValuationRequest>) => {
    setFormData(prev => ({ ...prev, ...extractedData }));
    setActiveModal(null);
  }, []);

  // Handler for DocumentationMode to send prompt to Audit
  const handleAuditFromDocument = useCallback((prompt: string) => {
    setFormData(prev => ({ ...prev, inputPrompt: prompt }));
    setCurrentView('audit');
  }, []);

  const handleCommand = useCallback((cmd: string) => {
    switch (cmd) {
      case 'document': setCurrentView('document'); break;
      case 'audit': setCurrentView('audit'); break;
      case 'settings': setActiveModal('settings'); break;
      case 'library': setActiveModal('library'); break;
      case 'smart': setActiveModal('smart'); break;
      case 'auto': setActiveModal('auto'); break;
    }
  }, []);

  const handleNavigate = useCallback((view: AppView) => {
    if (view === 'home') {
      setReport(null);
      setError(null);
    }
    setCurrentView(view);
  }, []);

  const resetTerminal = useCallback(() => {
    setReport(null);
    setError(null);
    setCurrentView('home');
  }, []);

  const generateCertificatePDF = async (report: ValuationReport | ValuationReport[]) => {
    setIsGeneratingPdf(true);
    try {
      const certificateContainer = document.createElement('div');
      certificateContainer.style.position = 'fixed';
      certificateContainer.style.left = '-9999px';
      certificateContainer.style.top = '0';
      document.body.appendChild(certificateContainer);

      const root = ReactDOM.createRoot(certificateContainer);
      const id = Array.isArray(report) 
        ? (report[0]?.watermark ?? 'MULTI-REPORT') 
        : report.watermark;

      root.render(<Certificate report={report} user="Verified User" id={id} />);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await (window as any).html2canvas(certificateContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#000000',
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = (window as any).jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const filename = Array.isArray(report)
        ? `Konkred-Portfolio-Certificate-${id}.pdf`
        : `Konkred-Certificate-${id}.pdf`;
      pdf.save(filename);

      root.unmount();
      document.body.removeChild(certificateContainer);
    } catch (e) {
      console.error("PDF generation failed", e);
      setError("Failed to generate PDF certificate.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // =============================================================
  // KEYBOARD SHORTCUTS
  // =============================================================

  useKeyboardShortcuts({
    openSettings: () => setActiveModal('settings'),
    openDocument: () => setCurrentView('document'),
    runAnalysis: handleAnalyze,
    closeModal: () => {
      setActiveModal(null);
      setIsCommandPaletteOpen(false);
    },
  });

  // =============================================================
  // INJECT STYLES
  // =============================================================

  useEffect(() => {
    const styleId = 'konkred-terminal-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        :root { --cursor-size: 20px; }
        .konkred-terminal-root { scroll-behavior: smooth; }
        .konkred-terminal-root ::-webkit-scrollbar { width: 6px; height: 6px; }
        .konkred-terminal-root ::-webkit-scrollbar-track { background: #0a0a0a; }
        .konkred-terminal-root ::-webkit-scrollbar-thumb { background: #333; border: 1px solid #000; }
        .konkred-terminal-root ::-webkit-scrollbar-thumb:hover { background: #00f0ff; box-shadow: 0 0 10px #00f0ff; }
        .text-glow-red { text-shadow: 0 0 10px rgba(255, 42, 42, 0.7); }
        .text-glow-cyan { text-shadow: 0 0 10px rgba(0, 240, 255, 0.7); }
        .bg-grid-pattern { background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 30px 30px; }
        .crt-overlay { background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 2px, 3px 100%; pointer-events: none; }
        .shadow-neon-cyan { box-shadow: 0 0 20px rgba(0, 240, 255, 0.3); }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 3s ease-in-out infinite; }
        @keyframes gradient-x { 0%, 100% { background-position: 0% center; } 50% { background-position: 100% center; } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-fade-in-slow { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .konkred-terminal-root ::selection { background: rgba(0, 240, 255, 0.2); color: white; }
        @media print { .print\\:hidden { display: none !important; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // =============================================================
  // BOOT SCREEN
  // =============================================================

  if (isBooting) {
    return <KonkredLoader onComplete={() => setIsBooting(false)} />;
  }

  // =============================================================
  // RENDER
  // =============================================================

  return (
    <div className={`konkred-terminal-root min-h-screen bg-cyber-black text-slate-200 font-sans relative overflow-hidden selection:bg-cyber-cyan selection:text-black ${className} animate-fade-in-slow`} style={style}>
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      {preferences.crtEffect && (
        <div className="fixed inset-0 crt-overlay z-50 pointer-events-none opacity-40 mix-blend-overlay" />
      )}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent z-50 opacity-80" />
      
      {/* Ambient Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyber-cyan/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onCommand={handleCommand}
      />

      {/* Modals */}
      <NeuralLinkModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        activeProvider={activeProvider}
        setActiveProvider={setActiveProvider}
      />

      <MethodLibrary 
        isOpen={activeModal === 'library'} 
        onClose={() => setActiveModal(null)} 
      />

      {activeModal === 'smart' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm">
            <SmartAnalyzer 
              initialPrompt={formData.inputPrompt}
              onApply={handleSmartApply}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}

      {activeModal === 'auto' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-sm flex flex-col">
            <AutoAnalyzer onClose={() => setActiveModal(null)} />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-cyber-gray bg-cyber-black/90 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-6">
              <button onClick={() => handleNavigate('home')} className="flex items-center space-x-3 group">
                <div className="w-9 h-9 bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-sm flex items-center justify-center shadow-neon-cyan relative overflow-hidden group-hover:bg-cyber-cyan/20 transition-colors">
                  <Box className="text-cyber-cyan relative z-10" size={18} strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tighter text-white leading-none font-mono flex items-center gap-1">
                    KONKRED<span className="text-cyber-cyan">.AUDIT</span>
                  </h1>
                </div>
              </button>
              
              <div className="hidden md:block">
                <Breadcrumb view={currentView} method={valuationMethod} onNavigate={handleNavigate} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4 pr-4 border-r border-cyber-gray">
                <StatusIndicator status={systemStatus.neural} label="Neural" />
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-cyber-gray bg-cyber-dark/50 hover:bg-cyber-gray/50 hover:border-cyber-cyan text-xs font-mono text-slate-400 hover:text-white uppercase tracking-wider rounded-sm transition-all"
                >
                  <Command size={14} />
                  <span className="hidden sm:inline">Menu</span>
                  <kbd className="text-[9px] text-slate-600 bg-cyber-gray/50 px-1.5 py-0.5 rounded ml-1">⌘K</kbd>
                </button>

                <button 
                  onClick={() => setActiveModal('settings')}
                  className="flex items-center gap-2 px-3 py-1.5 border border-cyber-gray bg-cyber-dark/50 hover:bg-cyber-gray/50 hover:border-cyber-cyan text-xs font-mono text-slate-400 hover:text-white rounded-sm transition-all"
                >
                  <Settings size={14} className={systemStatus.neural === 'online' ? 'text-green-500' : 'text-red-500'} />
                  <span className="hidden sm:inline">Neural Link</span>
                </button>

                {currentView !== 'document' && (
                  <button 
                    onClick={() => setCurrentView('document')}
                    className="flex items-center gap-2 px-3 py-1.5 border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500 text-xs font-mono text-purple-400 hover:text-white uppercase tracking-wider rounded-sm transition-all group"
                  >
                    <BookOpen size={14} className="group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Document</span>
                  </button>
                )}

                {currentView !== 'audit' && currentView !== 'results' && (
                  <button 
                    onClick={() => setCurrentView('audit')}
                    className="flex items-center gap-2 px-3 py-1.5 border border-cyber-cyan/50 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 hover:border-cyber-cyan text-xs font-mono text-cyber-cyan hover:text-white uppercase tracking-wider rounded-sm transition-all"
                  >
                    <BarChart3 size={14} />
                    <span className="hidden sm:inline">Audit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10 min-h-[80vh]">
        
        {isLoading && (
          <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
            <TerminalLoader 
                isMultiRun={['ALL', 'CORE'].includes(valuationMethod)} 
                protocols={valuationMethod === 'CORE' ? ['DLA', 'PVC', 'SCOPE'] : undefined}
            />
          </div>
        )}

        {!isLoading && currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} systemStatus={systemStatus} />
        )}

        {/* Document View */}
        {!isLoading && currentView === 'document' && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <DocumentationMode
              onClose={() => handleNavigate('home')}
              onAuditPrompt={handleAuditFromDocument}
              apiKeys={apiKeys}
              activeProvider={activeProvider}
              initialPrompt={formData.inputPrompt}
            />
          </div>
        )}

        {!isLoading && currentView === 'audit' && !report && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white font-mono">Valuation Console</h2>
                <p className="text-slate-500 text-sm mt-1">Select a protocol and configure your analysis parameters</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveModal('smart')}
                  className="flex items-center gap-2 px-3 py-1.5 border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-mono text-purple-400 rounded-sm transition-all"
                >
                  <Sparkles size={14} />
                  Smart Fill
                </button>
                <button 
                  onClick={() => setActiveModal('auto')}
                  className="flex items-center gap-2 px-3 py-1.5 border border-green-500/50 bg-green-500/10 hover:bg-green-500/20 text-xs font-mono text-green-400 rounded-sm transition-all"
                >
                  <Zap size={14} />
                  Auto-Analyze
                </button>
              </div>
            </div>
            
            <AnalysisForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              valuationMethod={valuationMethod}
              setValuationMethod={setValuationMethod}
              apiKeys={apiKeys}
              activeProvider={activeProvider}
            />
          </div>
        )}

        {!isLoading && (currentView === 'results' || report) && (
          <div className="animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyber-gray pb-4">
              <div className="flex items-center gap-4">
                <button onClick={resetTerminal} className="group flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-cyber-cyan transition-colors uppercase tracking-wider">
                  <Terminal size={14} className="group-hover:-translate-x-1 transition-transform" />
                  <span>New Analysis</span>
                </button>
                <button 
                  onClick={() => report && generateCertificatePDF(report)}
                  disabled={isGeneratingPdf || !report}
                  className="group flex items-center space-x-2 text-xs font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 px-3 py-1.5 rounded-sm hover:bg-cyber-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGeneratingPdf ? <Loader2 size={14} className="animate-spin"/> : <Award size={14} />}
                  <span>{isGeneratingPdf ? 'Generating...' : 'Get Certificate'}</span>
                </button>
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                SESSION ID: <span className="text-slate-400 font-bold">
                  {report && (Array.isArray(report) ? report[0]?.watermark : report.watermark)}
                </span>
              </div>
            </div>
            
            {report && <AnalysisResult report={report} />}
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded relative overflow-hidden animate-in shake">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="font-mono text-sm uppercase tracking-widest mb-2 font-bold">Protocol Failure</p>
                <p className="font-mono text-sm opacity-80">{error}</p>
                {!apiKeys[activeProvider] && (
                  <button onClick={() => setActiveModal('settings')} className="mt-3 text-xs underline hover:text-white transition-colors">
                    Configure API Key for {activeProvider} in Neural Link Settings
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center mt-20 mb-10 print:hidden relative z-50">
        <div className="w-max flex items-center gap-5 bg-[#050505]/90 backdrop-blur-md border border-cyber-gray/50 rounded-full px-6 py-2.5 shadow-lg hover:border-cyber-cyan/50 transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <a href="https://x.com/konkred" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform">
              <X size={16} />
            </a>
            <span className="text-slate-200 font-bold tracking-widest uppercase font-mono text-xs group-hover:text-cyber-cyan transition-colors">
              KONKRED SYSTEMS
            </span>
          </div>
          <div className="w-px h-4 bg-cyber-gray" />
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs font-mono uppercase tracking-wider">ARI MIYANJI</span>
            <a href="https://www.linkedin.com/in/ari-miyanji-a4039a291/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KonkredTerminal;
