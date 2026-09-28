import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Eye,
  CheckCheck,
  TrendingUp,
  FileCode,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  SmartphoneNfc,
  ClipboardList,
  Edit3,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CampaignsView: React.FC = () => {
  const { metaConfig, campaigns, templates, segments, contacts, createCampaign } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New campaign form state
  const [campaignName, setCampaignName] = useState('Diwali 2026 Morbi Dealer Special Offer');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [audienceType, setAudienceType] = useState<'segment' | 'all' | 'custom_numbers'>('segment');
  const [selectedSegmentId, setSelectedSegmentId] = useState(segments[0]?.id || '');
  const [manualNumbersText, setManualNumbersText] = useState('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const isConnected = metaConfig.status === 'CONNECTED' && Boolean(metaConfig.phoneNumberId && metaConfig.wabaId);
  const approvedTemplates = templates.filter(t => t.status === 'APPROVED');
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || approvedTemplates[0];
  const targetSegment = segments.find(s => s.id === selectedSegmentId);

  // Extract variables like {{1}}, {{2}} from template body text
  const templateVariables = React.useMemo(() => {
    if (!selectedTemplate) return [];
    const matches = selectedTemplate.bodyText.match(/\{\{(\d+)\}\}/g) || [];
    const unique = Array.from(new Set(matches)).map(m => m.replace(/[\{\}]/g, ''));
    return unique.sort((a, b) => parseInt(a) - parseInt(b));
  }, [selectedTemplate]);

  // When template changes, initialize variable values with example values if available
  useEffect(() => {
    if (!selectedTemplate) return;
    const initialVars: Record<string, string> = {};
    templateVariables.forEach((num, idx) => {
      initialVars[num] = selectedTemplate.exampleVariables?.[idx] || '';
    });
    setVariableValues(initialVars);
  }, [selectedTemplate?.id]);

  // Clean and parse manual numbers
  const parsedManualNumbers = React.useMemo(() => {
    if (!manualNumbersText) return [];
    // Split by newlines, commas, semicolons or spaces
    const tokens = manualNumbersText.split(/[\n,;\s]+/);
    const valid: string[] = [];
    tokens.forEach(tok => {
      const clean = tok.replace(/[^0-9+]/g, '');
      if (clean.length >= 10) {
        valid.push(clean);
      }
    });
    return Array.from(new Set(valid));
  }, [manualNumbersText]);

  // Render personalized template preview text with variables replaced
  const renderedPreviewText = React.useMemo(() => {
    if (!selectedTemplate) return '';
    let text = selectedTemplate.bodyText;
    templateVariables.forEach(num => {
      const val = variableValues[num] || `{{${num}}}`;
      text = text.replaceAll(`{{${num}}}`, val);
    });
    return text;
  }, [selectedTemplate, variableValues, templateVariables]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert('Pre-requisite missing: Pehle "WhatsApp Connection" me jakar apna Meta Phone Number ID aur WABA ID connect karein.');
      return;
    }

    if (!selectedTemplate) {
      alert('Pre-requisite missing: Broadcast bhejne ke liye pehle Meta se ek template "APPROVED" hona zaroori hai. "WhatsApp Templates" me template create karein.');
      return;
    }

    let recipientCount = 0;
    if (audienceType === 'all') {
      recipientCount = contacts.length;
    } else if (audienceType === 'segment') {
      recipientCount = targetSegment ? targetSegment.contactCount : 250;
    } else if (audienceType === 'custom_numbers') {
      recipientCount = parsedManualNumbers.length;
      if (recipientCount === 0) {
        alert('Kripya kam se kam ek valid WhatsApp mobile number paste karein.');
        return;
      }
    }

    await createCampaign({
      name: campaignName,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      category: selectedTemplate.category as any,
      audienceType,
      manualNumbersCount: audienceType === 'custom_numbers' ? recipientCount : undefined,
      variableValues,
      targetSegmentName: audienceType === 'segment' && targetSegment ? targetSegment.name : undefined,
      totalRecipients: recipientCount,
      status: 'SENDING',
      scheduledAt: new Date().toISOString()
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            WhatsApp Broadcast Campaigns
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Official Meta Cloud API
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Meta ke rules ke mutabiq broadcast bhejne ke liye pehle number connect hona chahiye aur template Meta se Approved hona zaroori hai.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
        >
          <Plus className="w-4 h-4" />
          Create Broadcast Campaign
        </button>
      </div>

      {/* Dependency Warning 1: Number Not Connected */}
      {!isConnected && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="block text-white">Pre-requisite #1: WhatsApp Number Connect Nahi Hai!</strong>
              <span>Broadcast bhejne se pehle aapka Phone Number ID aur WABA ID judna mandatory hai.</span>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'whatsapp-connection' }))}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shrink-0"
          >
            Connect Number First
          </button>
        </div>
      )}

      {/* Dependency Warning 2: No Approved Templates */}
      {isConnected && approvedTemplates.length === 0 && (
        <div className="bg-blue-950/40 border border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-start sm:items-center gap-3">
            <FileCode className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="block text-white">Pre-requisite #2: Koi Approved Template Nahi Hai!</strong>
              <span>Meta WhatsApp Cloud API bina Meta-Approved template ke broadcast bhejne ki permission nahi deta.</span>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'templates' }))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shrink-0"
          >
            Create & Submit Template
          </button>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Send className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">Koi Campaign Nahi Hai</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Aapka panel fresh hai! Jab aapka number connect hoga aur template approve hoga, tab aap 1-click me hazaron dealers ko broadcast bhej sakenge.
            </p>
          </div>
        ) : (
          campaigns.map(camp => {
            const sent = camp.sentCount;
            const delivered = camp.deliveredCount;
            const read = camp.readCount;
            const failed = camp.failedCount;
            const replied = camp.repliedCount;

            const deliveryRate = sent > 0 ? ((delivered / sent) * 100).toFixed(1) : '100';
            const readRate = sent > 0 ? ((read / sent) * 100).toFixed(1) : '85';
            const replyRate = sent > 0 ? ((replied / sent) * 100).toFixed(1) : '24';

            return (
              <div
                key={camp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-sm text-white">{camp.name}</h3>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        {camp.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span>Template: <strong className="text-slate-200 font-mono">{camp.templateName}</strong></span>
                      <span>•</span>
                      <span>
                        Audience: <strong className="text-slate-200">
                          {camp.audienceType === 'custom_numbers'
                            ? `Pasted Mobile Numbers (${camp.manualNumbersCount || camp.totalRecipients})`
                            : camp.targetSegmentName || 'All Contacts'}
                        </strong>
                      </span>
                      {camp.variableValues && Object.keys(camp.variableValues).length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            Custom Variables: {Object.entries(camp.variableValues).map(([k, v]) => `{{${k}}}: ${v}`).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    Total Recipients: <span className="font-bold text-white text-sm">{camp.totalRecipients}</span>
                  </div>
                </div>

                {/* Progress & Live Rates */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Sent Messages</div>
                    <div className="text-lg font-black text-white mt-0.5">{sent}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Dispatched</div>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Delivered</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">{delivered}</div>
                    <div className="text-[10px] text-emerald-400 font-medium mt-0.5">{deliveryRate}% success</div>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Read Rate</div>
                    <div className="text-lg font-black text-purple-400 mt-0.5">{read}</div>
                    <div className="text-[10px] text-purple-400 font-medium mt-0.5">{readRate}% opened</div>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Replied</div>
                    <div className="text-lg font-black text-teal-400 mt-0.5">{replied}</div>
                    <div className="text-[10px] text-teal-400 font-medium mt-0.5">{replyRate}% response</div>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Failed</div>
                    <div className="text-lg font-black text-rose-400 mt-0.5">{failed}</div>
                    <div className="text-[10px] text-rose-400 font-medium mt-0.5">Invalid numbers</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Schedule Broadcast Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {!isConnected ? (
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 space-y-2">
                <strong>Pehle WhatsApp Number Connect Karein:</strong>
                <p>Broadcast bhejne ke liye pehle Meta Phone Number ID aur WABA ID set karein.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'whatsapp-connection' }));
                  }}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl mt-1"
                >
                  Go to Connection Tab
                </button>
              </div>
            ) : approvedTemplates.length === 0 ? (
              <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-xl text-xs text-blue-200 space-y-2">
                <strong>Pehle Template Submit Karein:</strong>
                <p>Aapke paas abhi koi Approved Template nahi hai. Meta bina approved template ke message bhejne nahi deta.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'templates' }));
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl mt-1"
                >
                  Go to Templates Tab
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setAudienceType('segment')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        audienceType === 'segment'
                          ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        By Segment
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Dealer / VIP groups</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAudienceType('all')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        audienceType === 'all'
                          ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <SmartphoneNfc className="w-3.5 h-3.5 text-emerald-400" />
                        All Contacts
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{contacts.length} saved contacts</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAudienceType('custom_numbers')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        audienceType === 'custom_numbers'
                          ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
                        Paste Numbers
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Direct manual list</div>
                    </button>
                  </div>

                  {audienceType === 'segment' && segments.length > 0 && (
                    <select
                      value={selectedSegmentId}
                      onChange={(e) => setSelectedSegmentId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {segments.map(seg => (
                        <option key={seg.id} value={seg.id}>
                          {seg.name} ({seg.contactCount} contacts)
                        </option>
                      ))}
                    </select>
                  )}

                  {audienceType === 'custom_numbers' && (
                    <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                          Paste Mobile Numbers (Excel, WhatsApp, ya Text se)
                        </label>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {parsedManualNumbers.length} Valid Numbers Detected
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={manualNumbersText}
                        onChange={(e) => setManualNumbersText(e.target.value)}
                        placeholder={`Paste numbers separated by new line, comma, or space:\n9898012345\n+91 9988776655\n9724100000`}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                      />
                      <p className="text-[10px] text-slate-400">
                        Tip: Aap sidha Excel sheet ya WhatsApp group list se numbers copy karke yahan paste kar sakte hain. Duplicate numbers automatic filter ho jayenge.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Meta-Approved Template *</label>
                  <select
                    value={selectedTemplateId || approvedTemplates[0]?.id}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  >
                    {approvedTemplates.map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* TEMPLATE VARIABLES CUSTOMIZATION (Change values before sending) */}
                {selectedTemplate && templateVariables.length > 0 && (
                  <div className="p-3 bg-slate-950/90 rounded-xl border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <Edit3 className="w-3.5 h-3.5" />
                        Customize Body Variables ({templateVariables.length} Variables Found)
                      </div>
                      <span className="text-[10px] text-slate-400">Set real values for this broadcast</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {templateVariables.map((num) => (
                        <div key={num} className="space-y-1">
                          <label className="text-[11px] font-mono text-emerald-300 flex items-center justify-between">
                            <span>Variable {`{{${num}}}`}</span>
                            <span className="text-[10px] text-slate-500">Value for message</span>
                          </label>
                          <input
                            type="text"
                            value={variableValues[num] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariableValues(prev => ({ ...prev, [num]: val }));
                            }}
                            placeholder={`e.g. 15% OFF, Morbi, LR-9824...`}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LIVE RENDERED PREVIEW */}
                {selectedTemplate && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-emerald-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Live Rendered Message Preview:
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">What customers will see on WhatsApp</span>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-100 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                      {renderedPreviewText}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Schedule & Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
