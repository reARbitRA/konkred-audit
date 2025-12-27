
import React from 'react';
import { ValuationReport } from '../types';
import DLAResult from './DLAResult';
import PVCResult from './PVCResult';
import SCOREResult from './SCOREResult';
import EAVPResult from './EAVPResult';
import PRICEResult from './PRICEResult';
import VECTORResult from './VECTORResult';
import MultiReportResult from './MultiReportResult';
import AccoladesDisplay from './AccoladesDisplay';

interface AnalysisResultProps {
  report: ValuationReport | ValuationReport[];
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ report }) => {
  if (!report) {
    return null;
  }

  if (Array.isArray(report)) {
    return <MultiReportResult reports={report} />;
  }

  // Display generic accolades for single reports that support them
  const accolades = (report as any).accolades || [];

  const renderSpecificResult = () => {
    switch (report.method) {
      case 'DLA':
        return <DLAResult report={report} />;
      case 'PVC':
        return <PVCResult report={report} />;
      case 'SCOPE':
        return <SCOREResult report={report} />;
      case 'EAVP':
        return <EAVPResult report={report} />;
      case 'PRICE':
        return <PRICEResult report={report} />;
      case 'VECTOR':
        return <VECTORResult report={report} />;
      default:
        return <div className="text-cyber-red">Error: Unknown report type.</div>;
    }
  };

  return (
    <div className="space-y-8">
      {renderSpecificResult()}
      {/* For protocols like DLA/PRICE/EAVP/VECTOR which don't have Accolades nested inside their component yet */}
      {['DLA', 'PRICE', 'EAVP', 'VECTOR'].includes(report.method) && accolades.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <AccoladesDisplay accolades={accolades} />
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
