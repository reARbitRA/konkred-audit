
import React, { useState, useEffect } from 'react';
import { Check, Loader, Shield } from 'lucide-react';

const BOOT_LOGS = [
    "[0.001] KERNEL_V5.1 Initializing...",
    "[0.015] Loading KAVM modules...",
    "[0.023] Mounting file system... OK",
    "[0.031] Calibrating semantic cores (4)...",
    "[0.045] Neural Link Interface... ACTIVE",
    "[0.067] Risk Matrix... LOADED",
    "[0.088] Arbitrage Engine... ONLINE",
    "[0.101] Finalizing system handshake...",
];

const SYSTEMS = [
    { name: "NEURAL_LINK", icon: <Shield size={12} /> },
    { name: "ARBITRAGE_ENGINE", icon: <Check size={12} /> },
    { name: "RISK_MATRIX", icon: <Loader size={12} /> },
    { name: "SEMANTIC_CORE", icon: <Shield size={12} /> },
    { name: "VALUATION_DB", icon: <Check size={12} /> },
    { name: "OUTPUT_RENDERER", icon: <Loader size={12} /> },
];

type Phase = 'booting' | 'checking' | 'initializing' | 'ready' | 'finished';

interface KonkredLoaderProps {
    onComplete: () => void;
}

const KonkredLoader: React.FC<KonkredLoaderProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<Phase>('booting');
    const [bootIndex, setBootIndex] = useState(0);
    const [systemStatus, setSystemStatus] = useState<Record<string, 'pending' | 'scanning' | 'ok'>>(
        Object.fromEntries(SYSTEMS.map(s => [s.name, 'pending']))
    );
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Phase 1: Booting
        const bootInterval = setInterval(() => {
            setBootIndex(prev => {
                if (prev < BOOT_LOGS.length - 1) {
                    return prev + 1;
                }
                clearInterval(bootInterval);
                setTimeout(() => setPhase('checking'), 500);
                return prev;
            });
        }, 150);

        return () => clearInterval(bootInterval);
    }, []);

    useEffect(() => {
        if (phase !== 'checking') return;
        
        // Phase 2: System Check
        let checkIndex = 0;
        const checkInterval = setInterval(() => {
            if (checkIndex < SYSTEMS.length) {
                const systemName = SYSTEMS[checkIndex].name;
                setSystemStatus(prev => ({ ...prev, [systemName]: 'scanning' }));
                setTimeout(() => {
                    setSystemStatus(prev => ({ ...prev, [systemName]: 'ok' }));
                }, 300);
                checkIndex++;
            } else {
                clearInterval(checkInterval);
                setTimeout(() => setPhase('initializing'), 800);
            }
        }, 250);

        return () => clearInterval(checkInterval);
    }, [phase]);
    
    useEffect(() => {
        if (phase !== 'initializing') return;
        
        // Phase 3: Core Initialization
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;
                if (next >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => setPhase('ready'), 500);
                    return 100;
                }
                return next;
            });
        }, 20);

        return () => clearInterval(progressInterval);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'ready') return;
        
        // Phase 4: Ready
        setTimeout(() => {
            setPhase('finished');
            onComplete();
        }, 1000);
    }, [phase]);

    const renderPhase = () => {
        switch (phase) {
            case 'booting':
                return (
                    <div className="w-full max-w-lg p-4 font-mono text-cyber-green text-[10px] h-48 overflow-hidden">
                        {BOOT_LOGS.slice(0, bootIndex + 1).map((log, i) => (
                            <p key={i} className="animate-in fade-in">{log}</p>
                        ))}
                    </div>
                );
            case 'checking':
                return (
                    <div className="w-full max-w-lg p-4 grid grid-cols-2 gap-3 font-mono text-xs">
                        {SYSTEMS.map(sys => (
                            <div key={sys.name} className="flex items-center gap-3 p-2 bg-cyber-dark/50 border border-cyber-gray/30 rounded-sm">
                                {systemStatus[sys.name] === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-600" />}
                                {systemStatus[sys.name] === 'scanning' && <Loader size={12} className="text-cyber-cyan animate-spin" />}
                                {systemStatus[sys.name] === 'ok' && <Check size={12} className="text-cyber-green" />}
                                <span className={systemStatus[sys.name] === 'pending' ? 'text-slate-500' : 'text-white'}>{sys.name}</span>
                                <span className="ml-auto text-[10px]">
                                    {systemStatus[sys.name] === 'pending' && <span className="text-slate-600">PENDING</span>}
                                    {systemStatus[sys.name] === 'scanning' && <span className="text-cyber-cyan animate-pulse">SCANNING</span>}
                                    {systemStatus[sys.name] === 'ok' && <span className="text-cyber-green">ONLINE</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            case 'initializing':
                return (
                    <div className="w-full max-w-lg p-4 flex flex-col items-center">
                        <svg className="w-24 h-24 mb-6" viewBox="0 0 100 100">
                           <path d="M 50,10 L 90,50 L 50,90 L 10,50 Z" fill="none" stroke="#222" strokeWidth="4" />
                           <path d="M 50,10 L 90,50 L 50,90 L 10,50 Z" fill="none" stroke="white" strokeWidth="4" className="animate-stroke-draw" strokeDasharray="1000" />
                           <text x="50" y="60" textAnchor="middle" fontSize="40" fill="white" className="font-mono font-bold animate-fade-in-slow">K</text>
                        </svg>
                        <div className="w-full bg-cyber-gray/30 h-1 relative">
                            <div className="h-full bg-cyber-red" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                        </div>
                        <span className="text-cyber-red text-xs mt-3 font-mono tracking-widest animate-pulse">INITIALIZING CORE... {progress}%</span>
                    </div>
                );
            case 'ready':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-mono text-white tracking-widest animate-fade-in-slow">SYSTEM READY</h2>
                        <p className="text-cyber-cyan animate-fade-in-slow delay-500">KONKRED AUDIT v4.0</p>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-cyber-black transition-opacity duration-1000 ${phase === 'finished' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 crt-overlay opacity-50"></div>
            {renderPhase()}
        </div>
    );
};

export default KonkredLoader;
