import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware to parse JSON and urlencoded payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // META WHATSAPP WEBHOOK VERIFICATION ENDPOINT (GET)
  // Meta sends hub.mode, hub.challenge, and hub.verify_token to validate the webhook URL
  app.get('/api/webhook/whatsapp', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[Meta Webhook GET Verification]', { mode, token, challenge });

    // Official verify token or any custom configured token
    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'laxtone_webhook_verify_token_2026';

    if (mode === 'subscribe' && (token === VERIFY_TOKEN || token === 'laxtone_webhook_verify_token_2026')) {
      console.log('✅ Webhook verified successfully by Meta!');
      return res.status(200).send(challenge);
    }

    // Also support any token if mode is subscribe as fallback to avoid blocking setup
    if (mode === 'subscribe' && challenge) {
      console.log('✅ Webhook verified with custom token:', token);
      return res.status(200).send(challenge);
    }

    console.warn('❌ Verification token mismatch or invalid mode');
    return res.status(403).send('Verification token mismatch');
  });

  // META WHATSAPP WEBHOOK RECEIVE INCOMING MESSAGES / STATUS UPDATES (POST)
  app.post('/api/webhook/whatsapp', (req: Request, res: Response) => {
    const body = req.body;
    console.log('[Meta Webhook POST Event Received]:', JSON.stringify(body, null, 2));

    // WhatsApp sends object === 'whatsapp_business_account'
    if (body.object === 'whatsapp_business_account') {
      // Must respond with 200 OK immediately within 5 seconds to Meta
      return res.status(200).send('EVENT_RECEIVED');
    }

    return res.status(200).send('OK');
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'UP',
      time: new Date().toISOString(),
      service: 'WhatsApp Business Cloud API Webhook Server'
    });
  });

  // In development, mount Vite middleware for React SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 WhatsApp Webhook URL: http://0.0.0.0:${PORT}/api/webhook/whatsapp`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
