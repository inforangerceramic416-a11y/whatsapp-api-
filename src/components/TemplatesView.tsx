import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Send,
  Trash2,
  Copy,
  ExternalLink,
  Smartphone,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Video,
  MousePointerClick,
  Info,
  HelpCircle,
  Link,
  Phone,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhatsAppTemplate } from '../types';

export const TemplatesView: React.FC = () => {
  const { metaConfig, templates, createTemplate, deleteTemplate, refreshTemplatesFromMeta } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('ALL');
  const [previewTemplate, setPreviewTemplate] = useState<WhatsAppTemplate | null>(templates[0] || null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<WhatsAppTemplate | null>(null);

  // Sync previewTemplate with templates list
  useEffect(() => {
    if (templates.length === 0) {
      setPreviewTemplate(null);
    } else if (!previewTemplate || !templates.some(t => t.id === previewTemplate.id)) {
      setPreviewTemplate(templates[0]);
    }
  }, [templates]);

  // Official Meta Template Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'MARKETING' as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION',
    language: 'en',
    headerType: 'NONE' as 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT',
    headerText: '',
    headerMediaUrl: '',
    bodyText: '',
    variableSampleValues: {} as Record<string, string>,
    footerText: '',
    buttons: [] as Array<{
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phoneNumber?: string;
    }>
  });

  // Extract variables like {{1}}, {{2}} from body text in real time
  const detectedVariables = React.useMemo(() => {
    const matches = formData.bodyText.match(/\{\{(\d+)\}\}/g) || [];
    const unique = Array.from(new Set(matches)).map(m => m.replace(/[\{\}]/g, ''));
    return unique.sort((a, b) => parseInt(a) - parseInt(b));
  }, [formData.bodyText]);

  // Keep variable sample values in sync
  useEffect(() => {
    setFormData(prev => {
      const updatedSamples: Record<string, string> = { ...prev.variableSampleValues };
      detectedVariables.forEach(v => {
        if (!updatedSamples[v]) {
          updatedSamples[v] = '';
        }
      });
      return { ...prev, variableSampleValues: updatedSamples };
    });
  }, [detectedVariables]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTemplatesFromMeta();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleAddButton = (type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER') => {
    if (formData.buttons.length >= 3) {
      alert('Meta allows a maximum of 3 buttons per template.');
      return;
    }

    if (type === 'URL') {
      setFormData(prev => ({
        ...prev,
        buttons: [...prev.buttons, { type: 'URL', text: 'Visit Website', url: 'https://' }]
      }));
    } else if (type === 'PHONE_NUMBER') {
      setFormData(prev => ({
        ...prev,
        buttons: [...prev.buttons, { type: 'PHONE_NUMBER', text: 'Call Us', phoneNumber: '+91' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        buttons: [...prev.buttons, { type: 'QUICK_REPLY', text: 'Interested' }]
      }));
    }
  };

  const handleRemoveButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateButton = (index: number, updates: any) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.map((b, i) => (i === index ? { ...b, ...updates } : b))
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // GATE 1: Meta WABA Connection check
    if (!metaConfig.wabaId || metaConfig.status !== 'CONNECTED') {
      setSubmissionError(
        'WhatsApp Number Not Connected! Meta me template submit karne ke liye pahele "WhatsApp Connection" me jakar apna Phone Number ID aur WABA ID connect karein.'
      );
      return;
    }

    // GATE 2: Template Name formatting validation
    const formattedName = formData.name.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    if (!formattedName || formattedName.length < 2) {
      setSubmissionError('Template name valid hona chahiye (sirf lowercase english letters, numbers aur underscore).');
      return;
    }

    // GATE 3: Body text validation
    if (!formData.bodyText.trim()) {
      setSubmissionError('Message Body text khali nahi ho sakta.');
      return;
    }

    // GATE 4: Variable Sample Values validation (Meta strict requirement!)
    for (const v of detectedVariables) {
      if (!formData.variableSampleValues[v] || !formData.variableSampleValues[v].trim()) {
        setSubmissionError(
          `Meta Official Rule: Variable {{${v}}} ke liye Sample Value bharna mandatory hai. Agar sample value nahi hogi to Meta template reject kar dega.`
        );
        return;
      }
    }

    // GATE 5: Header Media sample URL validation
    if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(formData.headerType) && !formData.headerMediaUrl.trim()) {
      setSubmissionError(
        `Header me "${formData.headerType}" chuna hai to Sample Media URL/File link dena zaroori hai taaki Meta review kar sake.`
      );
      return;
    }

    // GATE 6: Button URL validation
    for (const btn of formData.buttons) {
      if (btn.type === 'URL' && (!btn.url || !btn.url.startsWith('http'))) {
        setSubmissionError(`Button "${btn.text}" ka URL sahi format me hona chahiye (e.g. https://...).`);
        return;
      }
      if (btn.type === 'PHONE_NUMBER' && (!btn.phoneNumber || btn.phoneNumber.length < 8)) {
        setSubmissionError(`Button "${btn.text}" ka Phone Number country code ke sath hona chahiye (e.g. +91...).`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Submitting template with official status: PENDING (Meta Review)
      await createTemplate({
        name: formattedName,
        category: formData.category,
        language: formData.language,
        status: 'PENDING', // Officially marked PENDING until approved by Meta API
        headerType: formData.headerType,
        headerText: formData.headerType === 'TEXT' ? formData.headerText : undefined,
        headerMediaUrl: ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(formData.headerType) ? formData.headerMediaUrl : undefined,
        bodyText: formData.bodyText,
        exampleVariables: detectedVariables.map(v => formData.variableSampleValues[v] || `Sample_${v}`),
        footerText: formData.footerText || undefined,
        buttons: formData.buttons
      });

      setIsSubmitting(false);
      setShowCreateModal(false);
      // Reset form
      setFormData({
        name: '',
        category: 'MARKETING',
        language: 'en',
        headerType: 'NONE',
        headerText: '',
        headerMediaUrl: '',
        bodyText: '',
        variableSampleValues: {},
        footerText: '',
        buttons: []
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(err.message || 'Meta API Submission error');
    }
  };

  const filteredTemplates = templates.filter(t => {
    if (selectedCategory === 'ALL') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            WhatsApp Template Manager
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Official Meta Cloud API
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Meta ke official rules ke anusar WhatsApp templates create karein. Har variable ke liye sample value aur media header mandatory hota hai.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            Refresh Meta Status
          </button>
          <button
            onClick={() => {
              setSubmissionError(null);
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Meta Guidelines & Pre-requisite Dependency Banner */}
      {metaConfig.status !== 'CONNECTED' ? (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="block text-white">Pre-requisite: WhatsApp Number Connect Nahi Hai!</strong>
              <span>Meta official rules ke anusar bina WABA ID aur Phone Number ID ke koi template submit ya approve nahi ho sakta.</span>
            </div>
          </div>
          <a
            href="#whatsapp-connection"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'whatsapp-connection' }));
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shrink-0 text-center"
          >
            Pahele Number Connect Karein
          </a>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Meta Connected WABA ID: <strong className="font-mono text-emerald-300">{metaConfig.wabaId}</strong> • Phone: <strong className="font-mono text-slate-200">{metaConfig.displayPhoneNumber}</strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold shrink-0">Official API v21.0</span>
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex items-center gap-2 text-xs">
        {(['ALL', 'MARKETING', 'UTILITY', 'AUTHENTICATION'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Template List + Live WhatsApp Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <FileCode className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Koi Template Nahi Hai</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Aapka panel fresh hai! Upar <strong>"Create Template"</strong> button par click karke apna pehla official WhatsApp template banayein.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create First Template
              </button>
            </div>
          ) : (
            filteredTemplates.map(tmpl => {
              const isSelected = previewTemplate?.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setPreviewTemplate(tmpl)}
                  className={`p-4 rounded-2xl bg-slate-900 border transition cursor-pointer ${
                    isSelected ? 'border-emerald-500 shadow-md shadow-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-white">{tmpl.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                        {tmpl.category}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {tmpl.language}
                      </span>
                      {tmpl.categoryChangedByMeta && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1" title={tmpl.categoryChangedByMeta.reason}>
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Meta Changed: {tmpl.categoryChangedByMeta.originalCategory} ➔ {tmpl.categoryChangedByMeta.newCategory}
                        </span>
                      )}
                    </div>

                    {/* Status Badge & Delete Action */}
                    <div className="flex items-center gap-2">
                      {tmpl.status === 'APPROVED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> APPROVED
                        </span>
                      )}
                      {tmpl.status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" /> PENDING META REVIEW
                        </span>
                      )}
                      {tmpl.status === 'REJECTED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTemplateToDelete(tmpl);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {tmpl.bodyText}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Header: <strong className="text-slate-200">{tmpl.headerType}</strong></span>
                    <span>Buttons: <strong className="text-slate-200">{tmpl.buttons.length} Interactive</strong></span>
                    <span className="text-emerald-400 font-medium">Click to Preview</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live WhatsApp Mobile Simulation Device Frame */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col items-center shadow-xl">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" /> WhatsApp Live Preview
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Meta Verified Preview</span>
          </div>

          {/* Smartphone Simulator Screen */}
          <div className="w-full max-w-[290px] bg-slate-950 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-2xl mt-3 my-2 text-xs flex flex-col">
            {/* WhatsApp App Bar */}
            <div className="bg-emerald-700 px-3 py-2 text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100/20 flex items-center justify-center font-bold text-xs">
                LX
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs truncate">{metaConfig.businessName || 'LAXTONE CERAMIC'}</div>
                <div className="text-[9px] text-emerald-100 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200" /> Official Business Account
                </div>
              </div>
            </div>

            {/* Chat Body Wallpaper */}
            <div className="p-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] bg-slate-900/90 flex-1 space-y-2 min-h-[340px]">
              {previewTemplate ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-slate-200 text-xs">
                  {/* Header Preview */}
                  {previewTemplate.headerType === 'IMAGE' && (
                    <img
                      src={previewTemplate.headerMediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                      alt="Header"
                      className="w-full h-28 object-cover"
                    />
                  )}
                  {previewTemplate.headerType === 'VIDEO' && (
                    <div className="w-full h-28 bg-slate-900 flex items-center justify-center text-slate-400 gap-2">
                      <Video className="w-6 h-6 text-emerald-400" />
                      <span>Video Header</span>
                    </div>
                  )}
                  {previewTemplate.headerType === 'DOCUMENT' && (
                    <div className="p-3 bg-slate-900 flex items-center gap-2 border-b border-slate-800 text-slate-300">
                      <FileText className="w-5 h-5 text-red-400" />
                      <span className="font-semibold text-xs">Document Attachment (.pdf)</span>
                    </div>
                  )}
                  {previewTemplate.headerType === 'TEXT' && (
                    <div className="px-3 pt-2 font-bold text-xs text-white">
                      {previewTemplate.headerText}
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="p-3 whitespace-pre-wrap leading-relaxed text-[11px]">
                    {previewTemplate.bodyText}
                  </div>

                  {/* Footer Text */}
                  {previewTemplate.footerText && (
                    <div className="px-3 pb-2 text-[9px] text-slate-400">
                      {previewTemplate.footerText}
                    </div>
                  )}

                  {/* Interactive Buttons */}
                  {previewTemplate.buttons.length > 0 && (
                    <div className="border-t border-slate-800 divide-y divide-slate-800 text-[11px] text-emerald-400 font-semibold text-center">
                      {previewTemplate.buttons.map((btn, idx) => (
                        <div key={idx} className="py-2 hover:bg-slate-800/60 transition flex items-center justify-center gap-1">
                          {btn.type === 'URL' && <ExternalLink className="w-3 h-3" />}
                          {btn.type === 'PHONE_NUMBER' && <Phone className="w-3 h-3" />}
                          {btn.type === 'QUICK_REPLY' && <MousePointerClick className="w-3 h-3" />}
                          <span>{btn.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-10">Select a template to view preview</div>
              )}
            </div>
          </div>

          {previewTemplate && (
            <div className="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">{previewTemplate.name}</span>
              <button
                type="button"
                onClick={() => {
                  setTemplateToDelete(previewTemplate);
                }}
                className="px-2.5 py-1 text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900 border border-red-500/30 rounded-lg text-[11px] flex items-center gap-1 font-semibold transition"
              >
                <Trash2 className="w-3 h-3" /> Delete Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OFFICIAL META CREATE TEMPLATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-400" />
                  Official Meta WhatsApp Template Creation
                </h3>
                <p className="text-[11px] text-slate-400">
                  Meta review team ke rules ke mutabiq sabhi fields aur sample data enter karein.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Error Banner */}
            {submissionError && (
              <div className="m-4 p-3 bg-red-950/60 border border-red-500/50 rounded-2xl text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-red-100">Meta Validation Failed:</strong>
                  <span>{submissionError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5 text-xs">
              {/* Section 1: Template Name, Category, Language */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 block text-xs border-b border-slate-800 pb-1">
                  1. Template Identifier & Category
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-slate-300 font-semibold mb-1">
                      Template Name (lowercase) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ceramic_exclusive_discount"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500">Only a-z, 0-9 & _</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="MARKETING">MARKETING (Offers, Catalogues)</option>
                      <option value="UTILITY">UTILITY (Orders, Invoices, Delivery)</option>
                      <option value="AUTHENTICATION">AUTHENTICATION (OTP & Security)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Language *</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="en">English (en)</option>
                      <option value="hi">Hindi (hi)</option>
                      <option value="gu">Gujarati (gu)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Header (Media or Text) */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 block text-xs border-b border-slate-800 pb-1">
                  2. Header (Optional - Media or Text)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Header Type</label>
                    <select
                      value={formData.headerType}
                      onChange={(e) => setFormData({ ...formData, headerType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="NONE">None (No Header)</option>
                      <option value="TEXT">Text Header</option>
                      <option value="IMAGE">Image (JPG/PNG)</option>
                      <option value="DOCUMENT">Document (PDF Brochure)</option>
                      <option value="VIDEO">Video (MP4)</option>
                    </select>
                  </div>

                  {formData.headerType === 'TEXT' && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Header Text *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LAXTONE NEW COLLECTION"
                        value={formData.headerText}
                        onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(formData.headerType) && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Sample Media URL (Required by Meta) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://yourdomain.com/sample_tile_catalogue.pdf"
                        value={formData.headerMediaUrl}
                        onChange={(e) => setFormData({ ...formData, headerMediaUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-[10px] text-slate-400">Meta reviewer will view this sample file</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Body & Variables */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 block text-xs border-b border-slate-800 pb-1">
                  3. Message Body & Dynamic Variables
                </span>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">
                      Body Message Text *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Use <code className="text-emerald-400 font-mono">{'{{1}}'}</code>, <code className="text-emerald-400 font-mono">{'{{2}}'}</code> for variables
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hello {{1}}, explore our new Vitrified Slabs with special discounts for {{2}}."
                    value={formData.bodyText}
                    onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Variable Samples Table (Mandatory for Meta Approval!) */}
                {detectedVariables.length > 0 && (
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Meta Variable Sample Values (Mandatory for Approval)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Meta rule: Har variable ka real example enter karein, warna Meta template reject kar deta hai.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {detectedVariables.map(v => (
                        <div key={v} className="flex items-center gap-2">
                          <span className="bg-slate-900 border border-slate-700 px-2 py-1.5 rounded-lg text-emerald-400 font-mono font-bold text-xs">
                            {`{{${v}}}`}
                          </span>
                          <input
                            type="text"
                            required
                            placeholder={`Sample value for {{${v}}} (e.g. Ramesh Patel)`}
                            value={formData.variableSampleValues[v] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                variableSampleValues: {
                                  ...formData.variableSampleValues,
                                  [v]: e.target.value
                                }
                              })
                            }
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Footer Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Laxtone Ceramic • Morbi Gujarat"
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 4: Interactive Buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-slate-200 block text-xs">
                    4. Interactive Buttons (Max 3)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddButton('QUICK_REPLY')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold"
                    >
                      + Quick Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('URL')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold"
                    >
                      + Web Link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('PHONE_NUMBER')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold"
                    >
                      + Call Phone
                    </button>
                  </div>
                </div>

                {formData.buttons.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No buttons added yet. Click above to add interactive buttons.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.buttons.map((btn, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            Button #{idx + 1} ({btn.type})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveButton(idx)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Button Display Text (e.g. View Catalogue)"
                            value={btn.text}
                            onChange={(e) => handleUpdateButton(idx, { text: e.target.value })}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />

                          {btn.type === 'URL' && (
                            <input
                              type="url"
                              required
                              placeholder="https://laxtoneceramic.com/catalogue"
                              value={btn.url}
                              onChange={(e) => handleUpdateButton(idx, { url: e.target.value })}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                            />
                          )}

                          {btn.type === 'PHONE_NUMBER' && (
                            <input
                              type="tel"
                              required
                              placeholder="+919099268044"
                              value={btn.phoneNumber}
                              onChange={(e) => handleUpdateButton(idx, { phoneNumber: e.target.value })}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900 pb-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 disabled:opacity-50 transition"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Submitting to Meta...
                    </>
                  ) : (
                    'Submit to Meta for Official Approval'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM IN-UI DELETE CONFIRMATION MODAL */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Delete WhatsApp Template?</h3>
                <p className="text-[11px] text-slate-400">This action will remove the template from your list.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-400">{templateToDelete.name}</div>
              <div className="text-[11px] text-slate-300 line-clamp-2">{templateToDelete.bodyText}</div>
            </div>

            <p className="text-xs text-slate-300">
              Kya aap sach me is template ko delete karna chahte hain?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const idToDelete = templateToDelete.id;
                  setTemplateToDelete(null);
                  await deleteTemplate(idToDelete);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
