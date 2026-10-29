import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  getHome(@Res() res: Response) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Restaurant Receptionist — Live Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 860px;
      width: 100%;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 80px -20px rgba(16, 185, 129, 0.15);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 9999px;
      color: #34d399;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 12px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
      margin-bottom: 0.8rem;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.6;
      max-width: 620px;
      margin: 0 auto 2.2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.2rem;
      margin-bottom: 2.2rem;
      text-align: left;
    }
    .card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.3rem;
      transition: all 0.2s ease;
    }
    .card:hover {
      border-color: rgba(52, 211, 153, 0.4);
      transform: translateY(-2px);
      background: rgba(30, 41, 59, 0.85);
    }
    .card-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.4rem;
    }
    .card-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-desc {
      font-size: 0.82rem;
      color: #94a3b8;
      margin-top: 0.4rem;
      font-family: 'JetBrains Mono', monospace;
      word-break: break-all;
    }
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
    a.btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0.85rem 1.6rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    a.btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
    }
    a.btn-primary:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.5);
    }
    a.btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
    }
    a.btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    .footer {
      margin-top: 2rem;
      font-size: 0.8rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="pulse-dot"></span>
      Service 100% Operational & Live
    </div>
    <h1>AI Restaurant Receptionist</h1>
    <p class="subtitle">Cloud Telephony Engine & Conversational Voice Agent Gateway for Twilio, ElevenLabs, and WhatsApp Cloud API.</p>

    <div class="grid">
      <div class="card">
        <div class="card-title">Telephony Hook</div>
        <div class="card-value">📞 Twilio Inbound Voice</div>
        <div class="card-desc">/webhook/voice/twilio/incoming</div>
      </div>
      <div class="card">
        <div class="card-title">Messaging Hook</div>
        <div class="card-value">💬 WhatsApp Cloud API</div>
        <div class="card-desc">/webhook/whatsapp</div>
      </div>
      <div class="card">
        <div class="card-title">Conversational Engine</div>
        <div class="card-value">🎙️ ElevenLabs ConvAI</div>
        <div class="card-desc">Bidirectional Audio Stream</div>
      </div>
    </div>

    <div class="btn-group">
      <a href="/api/docs" class="btn btn-primary">📖 Explore Interactive API Docs (Swagger)</a>
      <a href="/health" class="btn btn-secondary">🩺 Live System Health</a>
    </div>

    <div class="footer">
      Connected via Cloudflare Edge &bull; Render Cloud &bull; vortexlabsworld.com
    </div>
  </div>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}
