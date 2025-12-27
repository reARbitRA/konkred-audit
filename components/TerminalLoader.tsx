
import React, { useEffect, useState } from 'react';
import { Check, Loader2, Hourglass } from 'lucide-react';

const STATIC_LOG_MESSAGES = [
  "> [INIT] KAVM_Kernel_v2.5 loaded.",
  "> [AUTH] User verified. Security Level 4.",
  "> [SCAN] Parsing linguistic structures...",
  "> [DATA] Fetching industry multipliers...",
  "> [CALC] Applying Correction Tax algorithms...",
  "> [RISK] Running Monte Carlo simulations...",
  "> [DONE] Vector synthesis complete.",
  "> [OUT] Rendering dashboard..."
];

const DEFAULT_PROTOCOLS = ['DLA', 'PVC', 'SCOPE', 'EAVP', 'PRICE', 'VECTOR'];

interface TerminalLoaderProps {
  isMultiRun?: boolean;
  protocols?: string[];
}

const TerminalLoader: React.FC<TerminalLoaderProps> = ({ isMultiRun = false, protocols }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const targetProtocols = protocols || DEFAULT_PROTOCOLS;
  const [protocolStatus, setProtocolStatus] = useState<Record<string, 'pending' | 'running' | 'complete'>>(
    Object.fromEntries(targetProtocols.map(p => [p, 'pending']))
  );

  useEffect(() => {
    if (isMultiRun) {
      let currentIndex = 0;
      const runProtocol = () => {
        if (currentIndex < targetProtocols.length) {
          const currentProtocol = targetProtocols[currentIndex];
          setProtocolStatus(prev => ({ ...prev, [currentProtocol]: 'running' }));
          
          setTimeout(() => {
            setProtocolStatus(prev => ({ ...prev, [currentProtocol]: 'complete' }));
            currentIndex++;
            runProtocol();
          }, 400 + Math.random() * 200);
        }
      };
      runProtocol();
    } else {
      let logIndex = 0;
      const interval = setInterval(() => {
        if (logIndex < STATIC_LOG_MESSAGES.length) {
          setLogs(prev => [...prev, STATIC_LOG_MESSAGES[logIndex]]);
          logIndex++;
        } else {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isMultiRun, targetProtocols]);

  const renderStaticLoader = () => (
    <>
      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-500">
        <div className="bg-black border border-cyber-gray p-2 text-center transition-all hover:border-cyber-cyan">
           <span className="block text-cyber-cyan">TCS CORE</span>
           <span className="animate-pulse">CALCULATING</span>
        </div>
        <div className="bg-black border border-cyber-gray p-2 text-center transition-all hover:border-cyber-cyan">
           <span className="block text-cyber-cyan">MARKET</span>
           <span className="animate-pulse delay-75">SCANNING</span>
        </div>
        <div className="bg-black border border-cyber-gray p-2 text-center transition-all hover:border-cyber-cyan">
           <span className="block text-cyber-cyan">VECTOR</span>
           <span className="animate-pulse delay-150">OPTIMIZING</span>
        </div>
      </div>

      <div className="h-32 bg-black border border-cyber-gray p-3 font-mono text-[10px] text-cyber-green opacity-90 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-10"></div>
        <div className="flex flex-col justify-end h-full">
          {logs.map((log, i) => (
            <p key={i} className="animate-in slide-in-from-left-2 fade-in duration-100 whitespace-nowrap overflow-hidden text-ellipsis">
              {log}
            </p>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    </>
  );

  const renderMultiRunLoader = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
      {targetProtocols.map(proto => (
        <div key={proto} className="bg-black/60 border border-cyber-gray/50 p-4 rounded-sm flex items-center gap-3">
          <div>
            {protocolStatus[proto] === 'pending' && <Hourglass size={16} className="text-slate-600" />}
            {protocolStatus[proto] === 'running' && <Loader2 size={16} className="text-cyber-cyan animate-spin" />}
            {protocolStatus[proto] === 'complete' && <Check size={16} className="text-cyber-green" />}
          </div>
          <div>
            <div className="font-bold text-sm text-white">{proto}</div>
            <div className="text-[10px] uppercase tracking-widest">
              {protocolStatus[proto] === 'pending' && <span className="text-slate-500">QUEUED</span>}
              {protocolStatus[proto] === 'running' && <span className="text-cyber-cyan animate-pulse">EXECUTING</span>}
              {protocolStatus[proto] === 'complete' && <span className="text-cyber-green">COMPLETE</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl p-8 relative">
      <div className="absolute inset-0 bg-cyber-red/5 blur-3xl rounded-full animate-pulse-fast"></div>
      <div className="w-full space-y-6 relative z-10">
        <div className="flex justify-between items-end border-b border-cyber-red/30 pb-2">
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase font-mono flex items-center gap-2">
            <span className="animate-pulse text-cyber-red">>></span> 
            {isMultiRun ? 'Full Spectrum Audit' : 'KAVM Protocol'}
          </h2>
          <span className="text-[10px] font-mono text-cyber-cyan animate-glitch">v4.0.0</span>
        </div>
        <div className="relative h-4 bg-black border border-cyber-red/50 skew-x-[-10deg] overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
           <div className="h-full bg-cyber-red w-full animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_#ff2a2a]"></div>
           <div className="absolute inset-0 bg-cyber-red/20 animate-pulse"></div>
        </div>
        {isMultiRun ? renderMultiRunLoader() : renderStaticLoader()}
      </div>
    </div>
  );
};

export default TerminalLoader;
