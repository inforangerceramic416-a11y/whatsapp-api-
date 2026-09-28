import React, { useState } from 'react';
import {
  Webhook,
  Key,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Send,
  Code,
  Terminal,
  FileJson,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApiWebhooksView: React.FC = () => {
  const { metaConfig, webhookLogs, triggerTestWebhook } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'logs' | 'docs'>('endpoints');
  const [testEventType, setTestEventType] = useState('messages.incoming');
  const [isFiring, setIsFiring] = useState(false);

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestWebhook = async () => {
    setIsFiring(true);
    await triggerTestWebhook(testEventType);
    setTimeout(() => setIsFiring(false), 500);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://laxtoneceramic.com';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Developer API & Official Webhooks
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Graph v21.0
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure Meta Webhook callbacks for real-time incoming messages, status updates (delivered, read), and mobile app coexistence events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestWebhook}
            disabled={isFiring}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
          >
            <Send className="w-3.5 h-3.5" />
            {isFiring ? 'Sending Event...' : 'Fire Test Webhook'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'endpoints' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Meta Webhook Configuration
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'logs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Real-time Event Logs ({webhookLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'docs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          REST API Specs & Curl
        </button>
      </div>

      {/* Tab 1: Webhook Endpoints */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Webhook className="w-4 h-4 text-emerald-400" />
              Meta App Webhook Settings
            </h3>
            <p className="text-xs text-slate-400">
              Provide this Callback URL and Verify Token in your Meta App Dashboard under WhatsApp &gt; Configuration.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Callback URL (HTTPS Required)</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-emerald-300">
                  <span className="truncate flex-1">{currentOrigin}/api/webhook/whatsapp</span>
                  <button
                    onClick={() => copyToClipboard(`${currentOrigin}/api/webhook/whatsapp`, 'url')}
                    className="p-1 hover:text-white"
                  >
                    {copiedKey === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Verify Token</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-slate-200">
                  <span className="truncate flex-1">laxtone_webhook_verify_token_2026</span>
                  <button
                    onClick={() => copyToClipboard('laxtone_webhook_verify_token_2026', 'token')}
                    className="p-1 hover:text-white"
                  >
                    {copiedKey === 'token' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Webhook Subscription Fields</label>
                <div className="flex flex-wrap gap-1.5">
                  {['messages', 'message_template_status_update', 'message_echoes', 'phone_number_quality_update'].map(f => (
                    <span key={f} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Webhook Signature Validation (HMAC-SHA256)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every request from Meta contains the <code className="text-emerald-400 font-mono">X-Hub-Signature-256</code> header. Our server validates the HMAC payload using the secret before processing any customer tile orders.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="text-slate-500">// Example Node.js verification snippet:</div>
              <div>const signature = req.headers['x-hub-signature-256'];</div>
              <div>const expected = 'sha256=' + crypto.createHmac('sha256', META_APP_SECRET)</div>
              <div>&nbsp;&nbsp;.update(rawBody).digest('hex');</div>
              <div>if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {'{'}</div>
              <div>&nbsp;&nbsp;processWhatsAppPayload(req.body);</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Real-time Webhook Event Stream</h3>
            <span className="text-xs text-slate-400">Captured in Firestore Database</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {webhookLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{log.event}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      {log.statusCode} OK
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>
                <pre className="p-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {log.payload}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Docs */}
      {activeTab === 'docs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm text-xs">
          <h3 className="font-bold text-white text-sm">Official Meta Cloud API Endpoints</h3>
          <p className="text-slate-400 leading-relaxed">
            Directly invoke the WhatsApp Cloud API using standard HTTP POST requests:
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-emerald-400 text-xs overflow-x-auto whitespace-pre">
{`curl -X POST "https://graph.facebook.com/v21.0/${metaConfig.phoneNumberId}/messages" \\
  -H "Authorization: Bearer \${META_ACCESS_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "to": "919099268044",
    "type": "template",
    "template": {
      "name": "laxtone_catalogue_launch_2026",
      "language": { "code": "en" }
    }
  }'`}
          </div>
        </div>
      )}
    </div>
  );
};
