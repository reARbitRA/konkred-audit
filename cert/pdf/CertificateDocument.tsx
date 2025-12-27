
import React from 'react';
import { ValuationReport } from '../../types';

interface CertificateDocumentProps {
  report: ValuationReport;
  id: string;
}

const CertificateDocument: React.FC<CertificateDocumentProps> = ({ report, id }) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const verifyUrl = `https://konkred.audit/verify/${id}`;
  const promptTitle = report.promptTitle || 'Untitled Asset';

  return (
    <div style={{
      width: '210mm',
      height: '297mm',
      padding: '40px',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: "'JetBrains Mono', monospace",
      position: 'relative',
      boxSizing: 'border-box',
      border: '1px solid #333'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;700&display=swap');
        @page { size: A4 portrait; margin: 0; }
        body { margin: 0; -webkit-print-color-adjust: exact; }
      `}</style>

      {/* Corner Accents */}
      <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '2px solid #00f0ff', borderLeft: '2px solid #00f0ff' }}></div>
      <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '2px solid #00f0ff', borderRight: '2px solid #00f0ff' }}></div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '2px solid #00f0ff', borderLeft: '2px solid #00f0ff' }}></div>
      <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '2px solid #00f0ff', borderRight: '2px solid #00f0ff' }}></div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', paddingBottom: 20, marginBottom: 60, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>ARBITRA<span style={{ color: '#ff2a2a' }}>.AUDIT</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right', fontSize: 10, color: '#666' }}>
            ID: {id}
          </div>
          <a href={verifyUrl} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ width: 40, height: 40, padding: 2, background: '#111', border: '1px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Simplified QR Placeholder */}
                <div style={{ width: 32, height: 32, background: '#00f0ff', opacity: 0.2 }}></div>
            </div>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, margin: '0 0 10px 0', textTransform: 'uppercase' }}>Certificate of Valuation</h1>
        <p style={{ fontSize: 12, color: '#00f0ff', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 40 }}>
          Verified Asset Protocol
        </p>

        <div style={{ border: '1px solid #333', padding: 20, marginBottom: 40, textAlign: 'left', background: '#050505' }}>
          <div style={{ marginBottom: 10, fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Asset Designation</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{promptTitle}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
             <div>
                <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Valuation Method</div>
                <div style={{ fontSize: 14, fontFamily: 'monospace', color: '#00f0ff' }}>{report.method} Protocol</div>
             </div>
             <div>
                <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Watermark Hash</div>
                <div style={{ fontSize: 14, fontFamily: 'monospace', color: '#00f0ff' }}>{report.watermark.substring(0, 16)}...</div>
             </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 60 }}>
          <div style={{ background: '#0a0a0a', padding: 20, border: '1px solid #333' }}>
             <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Primary Metric</div>
             <div style={{ fontSize: 24, fontWeight: 'bold' }}>VERIFIED</div>
          </div>
          <div style={{ background: '#0a0a0a', padding: 20, border: '1px solid #333' }}>
             <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Audit Score</div>
             <div style={{ fontSize: 24, fontWeight: 'bold', color: '#00f0ff' }}>PASS</div>
          </div>
        </div>

        {/* Stamp */}
        <div style={{ width: 120, height: 120, border: '4px double #00f0ff', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f0ff' }}>
           <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: 8, letterSpacing: 2 }}>APPROVED</div>
             <div style={{ fontSize: 32, fontWeight: 'bold' }}>A+</div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, borderTop: '1px solid #333', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderBottom: '1px solid #666', width: 200, marginBottom: 5, color: '#00f0ff', fontFamily: 'serif', fontSize: 18 }}>Arbitra Auto-Signer</div>
          <div style={{ fontSize: 8, textTransform: 'uppercase', color: '#666' }}>Protocol Authority</div>
        </div>
        <div style={{ fontSize: 8, color: '#444', textAlign: 'right' }}>
          {timestamp} • SECURE HASH<br/>
          {verifyUrl}
        </div>
      </div>
    </div>
  );
};

export default CertificateDocument;
