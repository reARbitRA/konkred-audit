
import React, { useState } from 'react';
import { X, Book, Zap, FileText, ChevronRight, DollarSign, CheckSquare } from 'lucide-react';
import DLADoc from './docs/DLADoc';
import PVCDoc from './docs/PVCDoc';
import SCOPEDoc from './docs/SCOPEDoc';
import EAVPDoc from './docs/EAVPDoc';
import PRICEDoc from './docs/PRICEDoc';
import VECTORDoc from './docs/VECTORDoc';
import DLADocInteractive from './interactive/DLADocInteractive';
import PVCDocInteractive from './interactive/PVCDocInteractive';
import SCOPEDocInteractive from './interactive/SCOPEDocInteractive';
import EAVPDocInteractive from './interactive/EAVPDocInteractive';
import PRICEDocInteractive from './interactive/PRICEDocInteractive';
import VECTORDocInteractive from './interactive/VECTORDocInteractive';

interface MethodLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'interactive' | 'detailed';

const MethodLibrary: React.FC<MethodLibraryProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('DLA');
  const [viewMode, setViewMode] = useState<ViewMode>('interactive');

  if (!isOpen) return null;

  const protocols = {
    financial: [
      { id: 'DLA', label: 'D.L.A.', fullName: 'Is it Cheaper than a Human?', color: 'cyber-green' },
      { id: 'EAVP', label: 'E.A.V.P.', fullName: 'Did I *Actually* Save Time?', color: 'cyber-orange' },
      { id: 'PRICE', label: 'P.R.I.C.E.', fullName: 'How Much is it Worth?', color: 'cyber-cyan' },
    ],
    technical: [
      { id: 'PVC', label: 'P.V.C.', fullName: 'How Good is My Prompt?', color: 'cyber-purple' },
      { id: 'SCOPE', label: 'S.C.O.P.E.', fullName: 'How Well-Engineered is It?', color: 'cyber-yellow' },
      { id: 'VECTOR', label: 'V.E.C.T.O.R.', fullName: 'Is it Safe for Production?', color: 'cyber-red' },
    ]
  };

  const renderContent = () => {
    if (viewMode === 'interactive') {
      const components: Record<string, React.ReactNode> = {
        DLA: <DLADocInteractive />,
        PVC: <PVCDocInteractive />,
        SCOPE: <SCOPEDocInteractive />,
        EAVP: <EAVPDocInteractive />,
        PRICE: <PRICEDocInteractive />,
        VECTOR: <VECTORDocInteractive />,
      };
      return components[activeTab] || null;
    }
    // else detailed mode
    const components: Record<string, React.ReactNode> = {
      DLA: <DLADoc />,
      PVC: <PVCDoc />,
      SCOPE: <SCOPEDoc />,
      EAVP: <EAVPDoc />,
      PRICE: <PRICEDoc />,
      VECTOR: <VECTORDoc />,
    };
    return components[activeTab] || null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose}
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)`
        }}
      />
      
      <div className="bg-cyber-dark border border-cyber-cyan/30 w-full max-w-5xl h-[90vh] rounded-sm shadow-[0_0_50px_rgba(0,255,255,0.15)] relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="relative flex items-center justify-between p-4 border-b border-cyber-cyan/30 bg-gradient-to-r from-cyber-black via-cyber-dark to-cyber-black">
          <div className="absolute inset-0 bg-cyber-cyan/5" />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Book className="text-cyber-cyan" size={24} />
              <div className="absolute inset-0 blur-sm bg-cyber-cyan/50 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-mono font-bold uppercase tracking-wider text-lg">Protocol Library</h2>
              <p className="text-cyber-cyan/60 text-[10px] font-mono uppercase tracking-widest">6 Valuation Algorithms • Enterprise Grade</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-cyber-red transition-all hover:rotate-90 duration-300">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 bg-black/60 border-r border-cyber-gray/30 overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <DollarSign size={12} className="text-cyber-green" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyber-green">Financial & Business Impact</span>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-green/50 to-transparent" />
              </div>
              
              {protocols.financial.map(proto => (
                <button
                  key={proto.id}
                  onClick={() => setActiveTab(proto.id)}
                  className={`group w-full flex items-center gap-3 px-3 py-3 mb-1 font-mono transition-all rounded-sm relative overflow-hidden ${activeTab === proto.id ? 'bg-cyber-cyan/10 border-l-2 border-cyber-cyan' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                >
                  <div className="relative flex flex-col items-start">
                    <span className={`text-xs font-bold tracking-wider ${activeTab === proto.id ? 'text-cyber-cyan' : 'text-slate-400 group-hover:text-white'}`}>{proto.label}</span>
                    <span className="text-[9px] text-slate-600 group-hover:text-slate-500">{proto.fullName}</span>
                  </div>
                  <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === proto.id ? 'text-cyber-cyan translate-x-1' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-cyber-gray/20">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <CheckSquare size={12} className="text-cyber-purple" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyber-purple">Technical Quality & Risk</span>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-purple/50 to-transparent" />
              </div>
              
              {protocols.technical.map(proto => (
                <button
                  key={proto.id}
                  onClick={() => setActiveTab(proto.id)}
                  className={`group w-full flex items-center gap-3 px-3 py-3 mb-1 font-mono transition-all rounded-sm relative overflow-hidden ${activeTab === proto.id ? 'bg-cyber-cyan/10 border-l-2 border-cyber-cyan' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                >
                  <div className="relative flex flex-col items-start">
                    <span className={`text-xs font-bold tracking-wider ${activeTab === proto.id ? 'text-cyber-cyan' : 'text-slate-400 group-hover:text-white'}`}>{proto.label}</span>
                    <span className="text-[9px] text-slate-600 group-hover:text-slate-500">{proto.fullName}</span>
                  </div>
                  <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === proto.id ? 'text-cyber-cyan translate-x-1' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto relative">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
            <div className="relative z-10 p-8">
              {renderContent()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-cyber-gray/30 bg-black/60">
          <div className="flex items-center gap-2 p-1 bg-cyber-dark border border-cyber-gray rounded-sm">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${viewMode === 'interactive' ? 'bg-cyber-cyan text-black' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <Zap size={12} /> Interactive
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${viewMode === 'detailed' ? 'bg-cyber-cyan text-black' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <FileText size={12} /> Detailed
            </button>
          </div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-600">
            AAVM Protocol Database v3.1
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodLibrary;