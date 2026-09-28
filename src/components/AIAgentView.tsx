import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Bot,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Languages,
  BookOpen,
  Building2,
  Save,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIAgentView: React.FC = () => {
  const { aiAgentConfig, updateAIAgentConfig, companyProfile } = useApp();
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    aiName: aiAgentConfig.aiName,
    enabled: aiAgentConfig.enabled,
    systemInstruction: aiAgentConfig.systemInstruction,
    tone: aiAgentConfig.tone,
    maxAITurnsBeforeHandover: aiAgentConfig.maxAITurnsBeforeHandover,
    handoverTriggers: { ...aiAgentConfig.handoverTriggers }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAIAgentConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            AI WhatsApp Consultant & Handover
            <span className="text-xs bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-500/30">
              Hindi • Gujarati • English
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure intelligent conversational AI to qualify tile dealership inquiries, answer technical specifications, and automatically transfer conversations to human sales managers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Cloud
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Identity & Guardrails */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              Agent Configuration & Tone
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">AI Assistant Name</label>
                <input
                  type="text"
                  value={formData.aiName}
                  onChange={(e) => setFormData({ ...formData, aiName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tone & Persona</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="professional">Professional & Technical</option>
                  <option value="consultative">Consultative & Solution-focused</option>
                  <option value="friendly">Warm & Welcoming</option>
                  <option value="concise">Direct & Concise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                System Instructions & Domain Knowledge
              </label>
              <textarea
                rows={5}
                value={formData.systemInstruction}
                onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ground the AI strictly in Laxtone Ceramic specifications (carving finishes, full-body vitrified slabs, FOB Mundra port packaging).
              </p>
            </div>
          </div>

          {/* Handover Guardrails */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Human Handover Triggers (Strict Anti-Hallucination)
            </h3>
            <p className="text-xs text-slate-400">
              When triggered, AI ceases responses and tags human sales managers in the Shared Inbox.
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.handoverTriggers.priceNegotiation}
                  onChange={(e) => setFormData({
                    ...formData,
                    handoverTriggers: { ...formData.handoverTriggers, priceNegotiation: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">Commercial Price Negotiation / Rate Discussion</div>
                  <div className="text-[11px] text-slate-400">Never invent or confirm wholesale discounts automatically.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.handoverTriggers.customerRequestedHuman}
                  onChange={(e) => setFormData({
                    ...formData,
                    handoverTriggers: { ...formData.handoverTriggers, customerRequestedHuman: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">Customer Asks for Human / Agent Call</div>
                  <div className="text-[11px] text-slate-400">Immediately route when customer says "talk to agent" or "call me".</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.handoverTriggers.complaintDetected}
                  onChange={(e) => setFormData({
                    ...formData,
                    handoverTriggers: { ...formData.handoverTriggers, complaintDetected: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">Complaint / Tile Breakage / Delay Issue Detected</div>
                  <div className="text-[11px] text-slate-400">Transfers immediately to senior quality desk.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <Save className="w-4 h-4" />
              Save AI Settings
            </button>
          </div>
        </div>

        {/* Right Column: Knowledge Base & Languages */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Languages className="w-4 h-4 text-teal-400" />
              Supported Languages
            </h4>
            <div className="space-y-2">
              {['English (International & Domestic)', 'Hindi (हिंदी - उत्तर भारत)', 'Gujarati (ગુજરાતી - મોરબી વેપારી)'].map((lang, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-200">{lang}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Trained Knowledge Base
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200">Laxtone 2026 Master Catalogue</div>
                <div className="text-[10px] text-slate-400">PDF Document • 420 Tile SKUs Indexed</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200">ISO Packing Standards & Pallet Specs</div>
                <div className="text-[10px] text-slate-400">FOB Mundra & Domestic Truckloads</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
