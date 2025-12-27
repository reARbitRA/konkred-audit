
import React from 'react';
import { ValuationReport } from '../types';
import { 
  DollarSign, Cpu, Crosshair, ShieldCheck, Tag, GitBranch,
  CheckCircle, AlertTriangle, Crown, BarChart3, XCircle
} from 'lucide-react';

interface MultiReportResultProps {
  reports: ValuationReport[];
}

const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const getSummary = (report: ValuationReport) => {
  const iconProps = { size: 24, strokeWidth: 1.5 };
  switch (report.method) {
    case 'DLA':
      return {
        icon: <DollarSign {...iconProps} />,
        label: 'D.L.A. Net Value',
        value: formatMoney(report.calculations.trueNetValue),
        isPositive: report.calculations.isProfitable,
        color: report.calculations.isProfitable ? 'green' : 'red',
      };
    case 'PVC':
      return {
        icon: <Cpu {...iconProps} />,
        label: 'P.V.C. Score',
        value: report.calculations.finalScore.toFixed(1),
        isPositive: report.calculations.finalScore > 60,
        color: report.calculations.finalScore > 80 ? 'green' : report.calculations.finalScore > 50 ? 'cyan' : 'red',
      };
    case 'SCOPE':
        const pvi = report.calculations.pvi;
        return {
          icon: <Crosshair {...iconProps} />,
          label: 'S.C.O.P.E. Index',
          value: pvi.toFixed(2),
          isPositive: pvi > 1.0,
          color: pvi > 2.0 ? 'green' : pvi > 0.5 ? 'cyan' : 'red',
        };
    case 'EAVP':
        return {
            icon: <ShieldCheck {...iconProps} />,
            label: 'E.A.V.P. Audited Value',
            value: formatMoney(report.calculations.auditedValue),
            isPositive: report.calculations.auditedValue > 0,
            color: report.calculations.auditedValue > 0 ? 'green' : 'red',
          };
    case 'PRICE':
        return {
            icon: <Tag {...iconProps} />,
            label: 'P.R.I.C.E. TAV',
            value: formatMoney(report.calculations.totalAssetValue),
            isPositive: report.calculations.totalAssetValue > 0,
            color: 'cyan',
          };
    case 'VECTOR':
        return {
            icon: <GitBranch {...iconProps} />,
            label: 'V.E.C.T.O.R. Q-Score',
            value: `${(report.calculations.Q * 100).toFixed(0)}%`,
            isPositive: report.status === 'VIABLE ASSET',
            color: report.status === 'VIABLE ASSET' ? 'green' : 'red',
          };
    default:
      return null;
  }
};

const MultiReportResult: React.FC<MultiReportResultProps> = ({ reports }) => {
  const sortedReports = [...reports].sort((a, b) => {
    const order: ValuationReport['method'][] = ['DLA', 'PVC', 'SCOPE', 'EAVP', 'PRICE', 'VECTOR'];
    return order.indexOf(a.method) - order.indexOf(b.method);
  });
  
  return (
    <div className="pb-12 space-y-8 font-mono relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="bg-cyber-dark/40 border border-cyber-cyan p-6 text-center rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
            <h2 className="text-cyber-cyan text-sm uppercase tracking-[0.3em] font-bold">Full Spectrum Audit</h2>
            <p className="text-slate-500 text-xs mt-2">
                A comprehensive asset valuation across all six proprietary protocols.
            </p>
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedReports.map(report => {
          const summary = getSummary(report);
          if (!summary) return null;
          
          const colorClasses = {
            green: 'border-cyber-green/30 text-cyber-green hover:border-cyber-green hover:shadow-[0_0_20px_theme(colors.cyber.greenDim)]',
            red: 'border-cyber-red/30 text-cyber-red hover:border-cyber-red hover:shadow-[0_0_20px_theme(colors.cyber.redDim)]',
            cyan: 'border-cyber-cyan/30 text-cyber-cyan hover:border-cyber-cyan hover:shadow-[0_0_20px_theme(colors.cyber.cyanDim)]',
          };

          return (
            <div 
              key={report.method}
              className={`bg-cyber-dark/50 border rounded-sm p-6 transition-all duration-300 hover:-translate-y-1 ${colorClasses[summary.color as keyof typeof colorClasses]}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-black/50 rounded-sm`}>
                  {summary.icon}
                </div>
                {summary.isPositive ? 
                  <CheckCircle size={16} className="text-cyber-green" /> : 
                  <AlertTriangle size={16} className="text-cyber-red" />}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{summary.label}</p>
                <p className="text-4xl font-bold text-white tracking-tighter mt-1">{summary.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-black/60 backdrop-blur-sm border border-cyber-gray p-6 rounded-sm">
        <p className="text-xs text-slate-400 text-center font-mono">
          This multi-faceted analysis provides a holistic view of the prompt's value, quality, and risk. 
          Generate a <span className="font-bold text-cyber-cyan">Portfolio Certificate</span> for a consolidated, official record.
        </p>
      </div>

    </div>
  );
};

export default MultiReportResult;