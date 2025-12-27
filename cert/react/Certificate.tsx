
import React from 'react';
import { ValuationReport, Badge, SCOREReport } from '../../types';
import { CheckCircle, AlertTriangle, Crown, BarChart3, XCircle, QrCode } from 'lucide-react';

interface CertificateProps {
  report: ValuationReport | ValuationReport[];
  user: string;
  id: string;
}

const QRCodePlaceholder = ({ id, color }: { id: string, color: string }) => {
    const verifyUrl = `https://konkred.audit/verify/${id}`;
    // A sophisticated SVG placeholder that represents a QR code for the given ID
    return (
        <a href={verifyUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer text-decoration-none">
            <div className={`p-2 border border-neutral-800 bg-neutral-900/50 rounded-sm relative overflow-hidden transition-all duration-300 hover:border-${color}-500/50`}>
                <QrCode size={64} className={`text-${color}-500/80 group-hover:text-${color}-400 transition-colors`} />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" />
            </div>
            <span className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold group-hover:text-neutral-400 transition-colors">Scan to Verify</span>
        </a>
    );
};

const processSingleReport = (report: ValuationReport) => {
    let title = 'Certificate of Valuation';
    let primaryMetric = { label: 'Metric', value: 'N/A' };
    let secondaryMetrics: { label: string; value: string | number }[] = [];
    let score = 0;
    let grade = 'C';
    let colorClass = 'cyan';
    let verdict = { text: 'ANALYSIS COMPLETE', Icon: CheckCircle };

    const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    switch (report.method) {
      case 'DLA':
        title = 'Certificate of Labor Arbitrage';
        primaryMetric = { label: 'True Net Value / Run', value: formatMoney(report.calculations.trueNetValue) };
        secondaryMetrics = [
            { label: 'Gross Labor Value', value: formatMoney(report.calculations.grossLaborValue) },
            { label: 'Friction Cost', value: formatMoney(report.calculations.hiddenFrictionCost) },
            { label: 'Manual Time', value: `${report.calculations.manualMinutes.toFixed(1)} min` },
        ];
        score = report.calculations.isProfitable ? 85 + (report.calculations.trueNetValue / (report.calculations.grossLaborValue || 1)) * 10 : 40;
        if(report.calculations.isProfitable) {
          colorClass = 'green';
          verdict = { text: 'PROFITABLE ARBITRAGE', Icon: CheckCircle };
        } else {
          colorClass = 'red';
          verdict = { text: 'NEGATIVE ARBITRAGE', Icon: AlertTriangle };
        }
        break;
      case 'PVC':
        title = 'Certificate of Prompt Quality';
        primaryMetric = { label: 'Final Quality Score', value: report.calculations.finalScore.toFixed(1) };
        secondaryMetrics = [
            { label: 'Base Quality', value: report.calculations.baseQ.toFixed(1) },
            { label: 'Penalties Applied', value: (report.calculations.qPen - report.calculations.finalScore).toFixed(1) },
            { label: 'Token Count', value: report.tokenCount },
        ];
        score = report.calculations.finalScore;
        colorClass = score > 80 ? 'green' : score > 50 ? 'cyan' : 'red';
        verdict = { text: 'QUALITY AUDIT PASSED', Icon: CheckCircle };
        break;
      case 'SCOPE': {
        const scopeReport = report as SCOREReport;
        title = 'Certificate of Semantic Efficiency';
        primaryMetric = { label: 'Prompt Value Index (PVI)', value: scopeReport.calculations.pvi.toFixed(3) };
        secondaryMetrics = [
            { label: 'Structure', value: scopeReport.variables.S.toFixed(2) },
            { label: 'Constraint Hardness', value: scopeReport.variables.H.toFixed(2) },
            { label: 'Token Efficiency', value: `${(scopeReport.variables.Teff*100).toFixed(0)}%` },
        ];
        score = scopeReport.calculations.pvi * 30;
        if (scopeReport.calculations.pvi > 2.0) {
            colorClass = 'green';
            verdict = { text: 'HIGH-VALUE ASSET', Icon: Crown };
        } else if (scopeReport.calculations.pvi > 0.5) {
            colorClass = 'cyan';
            verdict = { text: 'MARKET STANDARD', Icon: BarChart3 };
        } else {
            colorClass = 'red';
            verdict = { text: 'SCRAP VALUE', Icon: XCircle };
        }
        break;
      }
      case 'EAVP':
        title = 'Certificate of Empirical Verification';
        primaryMetric = { label: 'Net Audited Value', value: formatMoney(report.calculations.auditedValue) };
        secondaryMetrics = [
            { label: 'Net Minutes Saved', value: `${report.calculations.netMinutesSaved.toFixed(1)} min` },
            { label: 'Correction Tax', value: `-${formatMoney(report.calculations.correctionCost)}` },
            { label: 'Gross Labor Value', value: formatMoney(report.calculations.grossLaborValue) },
        ];
        score = report.calculations.auditedValue > 0 ? 90 : 30;
        if(report.calculations.auditedValue > 0) {
            colorClass = 'green';
            verdict = { text: 'VERIFIED EFFICIENT', Icon: CheckCircle };
        } else {
            colorClass = 'red';
            verdict = { text: 'VERIFIED INEFFICIENT', Icon: AlertTriangle };
        }
        break;
      case 'PRICE':
        title = 'Certificate of Financial Valuation';
        primaryMetric = { label: `Total Asset Value (${report.inputRequest.useCase})`, value: formatMoney(report.calculations.totalAssetValue) };
        secondaryMetrics = [
            { label: 'Net Savings / Run', value: formatMoney(report.calculations.netRunSavings) },
            { label: 'Freelance Price', value: formatMoney(report.calculations.freelancePrice) },
            { label: 'Marketplace Price', value: formatMoney(report.calculations.marketplacePrice) },
        ];
        score = Math.min(100, 50 + Math.log10(Math.max(1, report.calculations.totalAssetValue)) * 10);
        colorClass = 'green';
        verdict = { text: 'FINANCIAL ASSET CERTIFIED', Icon: CheckCircle };
        break;
      case 'VECTOR':
        title = 'Certificate of Production Viability';
        primaryMetric = { label: 'Reliability Coefficient (Q)', value: `${(report.calculations.Q * 100).toFixed(0)}%` };
        secondaryMetrics = [
            { label: 'Net Utility / Run', value: formatMoney(report.calculations.net_utility) },
            { label: 'Annual Value', value: formatMoney(report.calculations.total_annual_value) },
            { label: 'Correction Tax', value: `-${formatMoney(report.calculations.correction_cost)}` },
        ];
        score = report.calculations.Q * 100;
        if(report.status === 'VIABLE ASSET') {
            colorClass = 'green';
            verdict = { text: 'PRODUCTION VIABLE', Icon: CheckCircle };
        } else {
            colorClass = 'red';
            verdict = { text: 'SCRAP ASSET', Icon: XCircle };
        }
        break;
    }

    score = Math.max(0, Math.min(score, 100));
    if (score >= 95) grade = 'S';
    else if (score >= 85) grade = 'A+';
    else if (score >= 75) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 40) grade = 'C';
    else grade = 'D';

    return { title, primaryMetric, secondaryMetrics, score, grade, colorClass, verdict };
};


const Certificate: React.FC<CertificateProps> = ({ report, user, id }) => {

  // Logic to determine title: Use promptTitle if available, else first line of prompt, else default
  const titleFromReport = Array.isArray(report) ? report[0].promptTitle : report.promptTitle;
  const inputPrompt = (Array.isArray(report) ? report[0].inputPrompt : report.inputPrompt) || '';
  const firstLineTitle = inputPrompt.split('\n')[0].substring(0, 80);
  
  const promptTitle = titleFromReport || (firstLineTitle ? firstLineTitle : 'Untitled Asset');

  const verifyUrl = `konkred.audit/verify/${id}`;

  if (!Array.isArray(report)) {
    const { title, primaryMetric, secondaryMetrics, score, grade, colorClass, verdict } = processSingleReport(report);
    const colors = { green: 'border-cyber-green text-cyber-green', red: 'border-cyber-red text-cyber-red', cyan: 'border-cyber-cyan text-cyber-cyan' };
    
    return (
        <div className={`w-[210mm] h-[297mm] bg-black text-white relative overflow-hidden font-mono p-10 border border-neutral-800 mx-auto shadow-2xl`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan"></div>
            <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan"></div>

            <header className="flex justify-between items-end border-b-2 border-neutral-800 pb-6 mb-12 relative z-10">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="text-2xl font-bold tracking-tighter">KONKRED<span className="text-red-500">.AUDIT</span></div>
                        <div className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase mt-1">Valuation Protocol v4.0</div>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Certificate ID</div>
                        <div className="text-xs font-mono text-white mb-1">{id}</div>
                    </div>
                    <QRCodePlaceholder id={id} color={colorClass} />
                </div>
            </header>
            <main className="text-center relative z-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">{title}</h1>
                <p className="text-xs text-cyber-cyan uppercase tracking-[0.4em] mb-8">Verified Intellectual Property Asset</p>
                
                <div className="border border-neutral-700 bg-black/30 p-6 mb-10 text-left rounded-sm max-w-2xl mx-auto shadow-lg">
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1 font-bold">Asset Designation</p>
                    <p className="text-xl text-white font-mono whitespace-nowrap overflow-hidden text-ellipsis font-bold tracking-wide">
                        {promptTitle}
                    </p>
                </div>

                <div className={`mb-12 inline-block p-6 border-2 ${colors[colorClass as keyof typeof colors]}`}>
                    <p className="text-[10px] uppercase tracking-widest mb-2 opacity-70">{primaryMetric.label}</p>
                    <p className="text-6xl font-bold">{primaryMetric.value}</p>
                </div>
                <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 mb-16 text-left">
                    {secondaryMetrics.map((m, i) => (
                    <div key={i} className="border border-neutral-800 bg-black p-4">
                        <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-2">{m.label}</div>
                        <div className="text-xl font-bold text-white truncate">{m.value}</div>
                    </div>
                    ))}
                </div>
                <div className="flex justify-center items-center gap-12 mb-16">
                    <div className={`relative w-32 h-32 flex items-center justify-center border-2 rounded-full ${colors[colorClass as keyof typeof colors]}`}>
                        <div className={`absolute inset-0 border border-dashed rounded-full animate-spin-slow opacity-30 ${colors[colorClass as keyof typeof colors]}`}></div>
                        <div className="text-center">
                            <div className="text-[8px] uppercase tracking-widest mb-1">Grade</div>
                            <div className="text-5xl font-bold text-white">{grade}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Aggregate Score</div>
                        <div className="text-6xl font-bold text-white">{score.toFixed(0)}</div>
                    </div>
                    <div className={`p-4 border ${colors[colorClass as keyof typeof colors]}`}>
                        <verdict.Icon size={32} className="mx-auto mb-2"/>
                        <p className="text-[10px] uppercase tracking-widest">{verdict.text}</p>
                    </div>
                </div>
            </main>
            <footer className="absolute bottom-10 left-10 right-10 border-t-2 border-neutral-800 pt-8 flex justify-between items-end z-10">
                <div className="text-center">
                    <div className="h-8 border-b border-neutral-600 mb-2 w-48 mx-auto text-cyan-400 font-cursive text-lg">KONKRED Auto-Signer</div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest">Authorized Signature</div>
                </div>
                <div className="text-[9px] text-neutral-600 font-mono text-right">
                    <div>GENERATED: {new Date().toISOString()}</div>
                    <div>METHODOLOGY: {report.method} PROTOCOL</div>
                    <div className="mt-1 text-neutral-500">{verifyUrl}</div>
                </div>
            </footer>
        </div>
    );
  }

  // Multi-report "Portfolio" certificate
  const summaries = report.map(r => processSingleReport(r));
  const totalScore = summaries.reduce((acc, s) => acc + s.score, 0);
  const aggregateScore = totalScore / summaries.length;
  let aggregateGrade = 'C';
  if (aggregateScore >= 95) aggregateGrade = 'S';
  else if (aggregateScore >= 85) aggregateGrade = 'A+';
  else if (aggregateScore >= 75) aggregateGrade = 'A';
  else if (aggregateScore >= 60) aggregateGrade = 'B';

  const colorClass = aggregateScore > 80 ? 'green' : aggregateScore > 50 ? 'cyan' : 'red';
  const colors = { green: 'border-cyber-green text-cyber-green', red: 'border-cyber-red text-cyber-red', cyan: 'border-cyber-cyan text-cyber-cyan' };

  return (
    <div className={`w-[210mm] h-[297mm] bg-black text-white relative overflow-hidden font-mono p-10 border border-neutral-800 mx-auto shadow-2xl`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan"></div>
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan"></div>

        <header className="flex justify-between items-end border-b-2 border-neutral-800 pb-6 mb-8 relative z-10">
            <div className="flex items-center gap-6">
                <div>
                    <div className="text-2xl font-bold tracking-tighter">KONKRED<span className="text-red-500">.AUDIT</span></div>
                    <div className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase mt-1">Portfolio Valuation v4.0</div>
                </div>
            </div>
            <div className="flex items-center gap-6 text-right">
                <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Portfolio ID</div>
                    <div className="text-xs font-mono text-white mb-1">{id.replace(/^[A-Z]+-/, 'ALL-')}</div>
                </div>
                <QRCodePlaceholder id={id} color={colorClass} />
            </div>
        </header>

        <main className="relative z-10">
            <h1 className="text-2xl text-center font-bold tracking-tight mb-2 uppercase">Full Spectrum Audit Certificate</h1>
            <p className="text-xs text-center text-cyber-cyan uppercase tracking-[0.4em] mb-4">Consolidated Multi-Protocol Asset Verification</p>

            <div className="border border-neutral-700 bg-black/30 p-4 mb-6 text-left rounded-sm max-w-3xl mx-auto shadow-lg">
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1 font-bold">Primary Asset</p>
                <p className="text-xl text-white font-mono whitespace-nowrap overflow-hidden text-ellipsis font-bold tracking-wide">
                    {promptTitle}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                {summaries.map(s => (
                   <div key={s.title} className="border border-neutral-800 bg-black/50 p-3">
                     <div className="flex justify-between items-center">
                       <div>
                         <div className="text-[9px] text-neutral-500 uppercase tracking-widest">{s.primaryMetric.label.split(' / ')[0]}</div>
                         <div className="text-lg font-bold text-white truncate">{s.primaryMetric.value}</div>
                       </div>
                       <div className="text-right">
                          <div className={`text-lg font-bold ${s.colorClass === 'green' ? 'text-cyber-green' : s.colorClass === 'cyan' ? 'text-cyber-cyan' : 'text-cyber-red'}`}>
                            {s.score.toFixed(0)}
                          </div>
                          <div className="text-[9px] text-neutral-500">SCORE</div>
                       </div>
                     </div>
                   </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center h-full">
                  <div className={`relative w-48 h-48 flex items-center justify-center border-2 rounded-full ${colors[colorClass as keyof typeof colors]}`}>
                      <div className={`absolute inset-0 border border-dashed rounded-full animate-spin-slow opacity-30 ${colors[colorClass as keyof typeof colors]}`}></div>
                      <div className="text-center">
                          <div className="text-[10px] uppercase tracking-widest mb-1">Grade</div>
                          <div className="text-7xl font-bold text-white">{aggregateGrade}</div>
                      </div>
                  </div>
                  <div className="text-center mt-6">
                    <div className="text-sm text-neutral-500 uppercase tracking-widest mb-1">Aggregate Score</div>
                    <div className="text-6xl font-bold text-white">{aggregateScore.toFixed(0)}</div>
                  </div>
              </div>
            </div>
        </main>
        
        <footer className="absolute bottom-10 left-10 right-10 border-t-2 border-neutral-800 pt-8 flex justify-between items-end z-10">
            <div className="text-center">
                <div className="h-8 border-b border-neutral-600 mb-2 w-48 mx-auto text-cyan-400 font-cursive text-lg">KONKRED Auto-Signer</div>
                <div className="text-[9px] text-neutral-500 uppercase tracking-widest">Authorized Signature</div>
            </div>
            <div className="text-[9px] text-neutral-600 font-mono text-right">
                <div>GENERATED: {new Date().toISOString()}</div>
                <div>METHODOLOGY: FULL SPECTRUM AUDIT</div>
                <div className="mt-1 text-neutral-500">{verifyUrl}</div>
            </div>
        </footer>
    </div>
  );
};

export default Certificate;
