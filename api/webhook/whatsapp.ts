import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 1. META WEBHOOK GET VERIFICATION
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[Vercel Meta Webhook GET]:', { mode, token, challenge });

    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'laxtone_webhook_verify_token_2026';

    if (mode === 'subscribe' && (token === VERIFY_TOKEN || token === 'laxtone_webhook_verify_token_2026')) {
      console.log('✅ Webhook verified successfully by Meta on Vercel!');
      return res.status(200).send(challenge);
    }

    if (mode === 'subscribe' && challenge) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send('Verification token mismatch');
  }

  // 2. META WEBHOOK POST INCOMING MESSAGES & STATUS EVENTS
  if (req.method === 'POST') {
    const body = req.body;
    console.log('[Vercel Meta Webhook POST Event]:', JSON.stringify(body, null, 2));

    // WhatsApp sends object === 'whatsapp_business_account'
    if (body && body.object === 'whatsapp_business_account') {
      return res.status(200).send('EVENT_RECEIVED');
    }

    return res.status(200).send('OK');
  }

  return res.status(405).send('Method Not Allowed');
}
