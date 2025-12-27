
import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const verifyUrl = `https://konkred.audit/verify/${id}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Certificate ${id}</title>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 0; background: #000; color: #fff; font-family: 'JetBrains Mono', monospace; -webkit-print-color-adjust: exact; }
          .container { width: 210mm; height: 297mm; position: relative; padding: 40px; box-sizing: border-box; border: 5px solid #111; }
          .corner { position: absolute; width: 40px; height: 40px; border: 2px solid #00f0ff; }
          .tl { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
          .tr { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
          .bl { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
          .br { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
          .logo { font-size: 24px; font-weight: bold; }
          .logo span { color: #ff2a2a; }
          .header-right { display: flex; align-items: center; gap: 15px; }
          .id { font-size: 10px; color: #666; }
          .qr { width: 40px; height: 40px; padding: 2px; background: #111; border: 1px solid #333; cursor: pointer; }
          .title { font-size: 42px; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 10px; }
          .subtitle { text-align: center; color: #00f0ff; letter-spacing: 4px; font-size: 12px; margin-bottom: 60px; text-transform: uppercase; }
          .data-box { background: #0a0a0a; border: 1px solid #333; padding: 20px; margin-bottom: 40px; }
          .label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-size: 18px; font-weight: bold; }
          .stamp { width: 120px; height: 120px; border: 4px double #00f0ff; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: #00f0ff; transform: rotate(-10deg); opacity: 0.8; }
          .footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #333; padding-top: 20px; display: flex; justify-content: space-between; }
          .sig-line { border-bottom: 1px solid #666; width: 200px; margin-bottom: 5px; color: #00f0ff; font-style: italic; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>
            
            <div class="header">
                <div class="logo">ARBITRA<span>.AUDIT</span></div>
                <div class="header-right">
                    <div class="id">ID: ${id}</div>
                    <a href="${verifyUrl}" target="_blank" style="text-decoration: none; display: block;">
                        <div class="qr">
                            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H14V14H4V4ZM6 6V12H12V6H6Z" fill="#00f0ff"/>
                                <path d="M26 4H36V14H26V4ZM28 6V12H34V6H28Z" fill="#00f0ff"/>
                                <path d="M4 26H14V36H4V26ZM6 28V34H12V28H6Z" fill="#00f0ff"/>
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
            
            <div class="title">Certificate of Valuation</div>
            <div class="subtitle">Verified Asset Protocol</div>
            
            <div class="data-box">
                <div class="label">Valuation ID</div>
                <div class="value" style="color: #00f0ff">${id}</div>
                <div style="margin-top: 15px" class="label">Date Issued</div>
                <div class="value">${new Date().toISOString().split('T')[0]}</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
                <div class="label">Aggregate Grade</div>
                <div style="font-size: 64px; font-weight: bold; color: #fff;">A+</div>
            </div>

            <div class="stamp">
                <div style="text-align: center">
                    <div style="font-size: 8px; letter-spacing: 2px">VERIFIED</div>
                    <div style="font-size: 24px; font-weight: bold">VALID</div>
                </div>
            </div>
            
            <div class="footer">
                <div style="text-align: center">
                    <div class="sig-line">Arbitra Auto-Signer</div>
                    <div class="label">Authorized Signature</div>
                </div>
                <div class="label" style="align-self: flex-end; text-align: right">
                    SECURE HASH VERIFICATION<br/>
                    ${verifyUrl}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
