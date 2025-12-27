
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '../types';

interface AccoladesDisplayProps {
  accolades: Badge[];
}

const tierStyles = {
  Gold: {
    bg: 'bg-cyber-orange/10',
    border: 'border-cyber-orange',
    text: 'text-cyber-orange',
    shadow: 'shadow-[0_0_20px_rgba(255,138,0,0.4)]',
    label: 'Supreme Tier',
    iconColor: 'text-cyber-orange'
  },
  Silver: {
    bg: 'bg-cyber-cyan/10',
    border: 'border-cyber-cyan',
    text: 'text-cyber-cyan',
    shadow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
    label: 'Elite Tier',
    iconColor: 'text-cyber-cyan'
  },
  Bronze: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500',
    text: 'text-slate-400',
    shadow: 'shadow-[0_0_10px_rgba(100,116,139,0.2)]',
    label: 'Validated Tier',
    iconColor: 'text-slate-500'
  },
};

const AccoladesDisplay: React.FC<AccoladesDisplayProps> = ({ accolades }) => {
  if (!accolades || accolades.length === 0) {
    return null;
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={24} /> : <LucideIcons.Award size={24} />;
  };

  return (
    <div className="bg-cyber-dark/40 border border-cyber-gray p-6 rounded-sm animate-in fade-in slide-in-from-top-4 duration-1000 overflow-hidden relative">
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
            <LucideIcons.ShieldAlert size={18} className="text-cyber-cyan animate-pulse" />
            <h3 className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
                Asset Achievement Matrix
            </h3>
        </div>
        <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest bg-black/40 px-3 py-1 border border-cyber-gray/30 rounded-full">
            {accolades.length} PROTOCOLS UNLOCKED
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
        {accolades.map((badge, idx) => (
          <div 
            key={badge.id}
            style={{ animationDelay: `${idx * 150}ms` }}
            className={`relative group p-5 border rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 animate-in zoom-in-95 ${tierStyles[badge.tier].bg} ${tierStyles[badge.tier].border} hover:${tierStyles[badge.tier].shadow}`}
          >
            {/* Holographic Background Wash */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
                 style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)' }}></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`flex-shrink-0 ${tierStyles[badge.tier].iconColor} group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12`}>
                {getIconComponent(badge.icon)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-white uppercase tracking-wider truncate group-hover:text-glow-white transition-all">{badge.name}</p>
                <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${tierStyles[badge.tier].text} opacity-80`}>{tierStyles[badge.tier].label}</p>
              </div>
            </div>
            
            {/* Description Tooltip (Simplified interaction) */}
            <div className="mt-4 pt-4 border-t border-cyber-gray/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <p className="font-mono text-[10px] leading-relaxed italic text-slate-400">
                {badge.description}
              </p>
            </div>

            {/* Holographic Shine Swipe Animation */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-45 group-hover:animate-shine pointer-events-none"></div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { left: -150%; }
          100% { left: 150%; }
        }
        .animate-shine {
          animation: shine 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .text-glow-white {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}} />
    </div>
  );
};

export default AccoladesDisplay;
