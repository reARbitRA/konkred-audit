
import React from 'react';
import { DocumentationData } from './DocumentationMode';
import { CheckCircle2, Clock, BarChart, AlertTriangle, Layers, Cpu, Database, Zap, BookOpen } from 'lucide-react';

interface AssetDocumentProps {
  data: DocumentationData;
  originalPrompt: string;
}

const A4_WIDTH = '210mm';
const A4_HEIGHT = '297mm';

const Page: React.FC<{ children: React.ReactNode; pageNum: number; totalPages: number; id: string; }> = ({ children, pageNum, totalPages, id }) => (
  <div id={id} style={{
    width: A4_WIDTH,
    height: A4_HEIGHT,
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #222',
    boxSizing: 'border-box'
  }}>
    <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-1px' }}>
                    KONKRED<span style={{ color: '#a855f7' }}>.ASSET</span>
                </div>
            </div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Verified Protocol v2.0
            </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
            {children}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#444' }}>
            <div>© KONKRED SYSTEMS 2025</div>
            <div>PAGE {pageNum} / {totalPages}</div>
        </div>
    </div>
  </div>
);

const AssetDocument: React.FC<AssetDocumentProps> = ({ data, originalPrompt }) => {
  return (
    <div>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        `}</style>

      {/* PAGE 1: EXECUTIVE SUMMARY */}
      <Page pageNum={1} totalPages={4} id="pdf-page-1">
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <div style={{ 
                display: 'inline-block', padding: '8px 16px', borderRadius: '20px', 
                backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', 
                fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' 
            }}>
                Premium Intelligence Asset
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '10px', textTransform: 'uppercase' }}>
                {data.PROMPT_TITLE}
            </h1>
            <p style={{ fontSize: '16px', color: '#888', maxWidth: '500px', margin: '0 auto 60px auto' }}>
                {data.PROMPT_DOES}
            </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '60px' }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '25px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Use Case</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{data.USE_CASE}</div>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '25px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Target Audience</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{data.BEST_FOR}</div>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '25px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Efficiency Gain</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#a855f7' }}>{data.TIME_SAVED}</div>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '25px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Complexity</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{data.DIFFICULTY}</div>
            </div>
        </div>

        <div style={{ padding: '20px', borderLeft: '4px solid #a855f7', background: 'rgba(168,85,247,0.05)' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#a855f7', textTransform: 'uppercase', marginBottom: '5px' }}>Optimization Notes</div>
            <div style={{ fontSize: '12px', color: '#ccc', fontStyle: 'italic' }}>
                "{data.OPTIMIZATION_NOTES || "Enhanced for logic flow and delimiter precision."}"
            </div>
        </div>
      </Page>

      {/* PAGE 2: TECHNICAL SPECS */}
      <Page pageNum={2} totalPages={4} id="pdf-page-2">
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '30px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Technical Specifications
        </h2>

        <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '15px' }}>Input Configuration</h3>
            <div style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                {data.INPUTS.map((input, i) => (
                    <div key={i} style={{ display: 'flex', borderBottom: '1px solid #222', padding: '12px 0' }}>
                        <div style={{ width: '120px', fontFamily: "'JetBrains Mono', monospace", color: '#a855f7', fontWeight: 'bold' }}>{input.name}</div>
                        <div style={{ flex: 1, color: '#ccc' }}>{input.desc}</div>
                        <div style={{ width: '150px', color: '#666', fontStyle: 'italic', textAlign: 'right' }}>{input.ex}</div>
                    </div>
                ))}
            </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '15px' }}>Output Specifications</h3>
            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '20px', borderRadius: '4px' }}>
                <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>Format: <span style={{ color: '#fff' }}>{data.OUTPUT_FORMAT}</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {data.OUTPUT_ELEMENTS.map((el, i) => (
                        <span key={i} style={{ padding: '4px 8px', background: '#222', color: '#ccc', fontSize: '10px', borderRadius: '2px' }}>{el}</span>
                    ))}
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '15px' }}>Industry Applications</h3>
                {data.INDUSTRIES.map((ind, i) => (
                    <div key={i} style={{ marginBottom: '10px', fontSize: '12px' }}>
                        <div style={{ color: '#fff', fontWeight: '600' }}>{ind.name}</div>
                        <div style={{ color: '#666', fontSize: '10px' }}>{ind.use}</div>
                    </div>
                ))}
            </div>
            <div>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '15px' }}>Operational Constraints</h3>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '12px', color: '#ccc' }}>
                    {data.LIMITATIONS.map((lim, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{lim}</li>
                    ))}
                </ul>
            </div>
        </div>
      </Page>

      {/* PAGE 3: SIMULATION */}
      <Page pageNum={3} totalPages={4} id="pdf-page-3">
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Gold Standard Simulation
        </h2>
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '30px' }}>
            Generated using the V2.0 Protocol with example inputs.
        </div>

        <div style={{ 
            background: '#0a0a0a', 
            border: '1px solid #333', 
            borderRadius: '4px',
            padding: '20px',
            fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#ccc',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            height: '750px',
            overflow: 'auto'
        }}>
            {data.SIMULATION || "Simulation data not available."}
        </div>
      </Page>

      {/* PAGE 4: THE ASSET */}
      <Page pageNum={4} totalPages={4} id="pdf-page-4">
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '30px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px' }}>
            The Asset Pack
        </h2>

        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#a855f7', borderRadius: '50%' }}></span>
                    Refined V2.0 Protocol
                </h3>
                <span style={{ fontSize: '10px', color: '#a855f7', border: '1px solid #a855f7', padding: '2px 6px', borderRadius: '2px' }}>OPTIMIZED</span>
            </div>
            <div style={{ 
                background: '#111', border: '1px solid #444', padding: '15px', borderRadius: '4px', 
                fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#a855f7', 
                whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '400px'
            }}>
                {data.REFINED_PROMPT}
            </div>
        </div>

        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#666', borderRadius: '50%' }}></span>
                    Original Source
                </h3>
                <span style={{ fontSize: '10px', color: '#666', border: '1px solid #333', padding: '2px 6px', borderRadius: '2px' }}>RAW</span>
            </div>
            <div style={{ 
                background: '#0a0a0a', border: '1px solid #222', padding: '15px', borderRadius: '4px', 
                fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#666', 
                whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '200px'
            }}>
                {originalPrompt}
            </div>
        </div>
      </Page>
    </div>
  );
};

export default AssetDocument;
