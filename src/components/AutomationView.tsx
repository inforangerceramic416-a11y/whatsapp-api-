import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Play,
  Pause,
  ArrowRight,
  Clock,
  Tag,
  UserCheck,
  Send,
  Bot,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  X,
  MessageSquare,
  FileCode,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AutomationWorkflow } from '../types';

export const AutomationView: React.FC<{ initialMode?: 'automation' | 'chatbots' }> = ({ initialMode = 'automation' }) => {
  const { automations, addAutomation, deleteAutomation, toggleAutomation, templates } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'keyword' | 'incoming'>(
    initialMode === 'chatbots' ? 'keyword' : 'all'
  );
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(automations[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating a new workflow
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'KEYWORD' | 'INCOMING_MESSAGE' | 'CLICK_TO_WHATSAPP'>('KEYWORD');
  const [keyword, setKeyword] = useState('');
  const [actionType, setActionType] = useState<'SEND_TEXT' | 'SEND_TEMPLATE' | 'ADD_TAG' | 'AI_REPLY'>('SEND_TEXT');
  const [actionText, setActionText] = useState('');
  const [actionTemplateName, setActionTemplateName] = useState(templates[0]?.name || '');
  const [actionTag, setActionTag] = useState('');

  // Filter workflows
  const filteredWorkflows = automations.filter(a => {
    if (filterType === 'keyword') return a.trigger?.type === 'KEYWORD';
    if (filterType === 'incoming') return a.trigger?.type === 'INCOMING_MESSAGE' || a.trigger?.type === 'CLICK_TO_WHATSAPP';
    return true;
  });

  const selectedWorkflow = automations.find(a => a.id === selectedWorkflowId) || filteredWorkflows[0] || null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSteps: AutomationWorkflow['steps'] = [];

    if (actionType === 'SEND_TEXT') {
      newSteps.push({
        id: '1',
        action: 'SEND_TEXT',
        params: { text: actionText || 'Namaste! Welcome to our official WhatsApp service.' }
      });
    } else if (actionType === 'SEND_TEMPLATE') {
      newSteps.push({
        id: '1',
        action: 'SEND_TEMPLATE',
        params: { templateName: actionTemplateName || 'welcome_greeting' }
      });
    } else if (actionType === 'ADD_TAG') {
      newSteps.push({
        id: '1',
        action: 'ADD_TAG',
        params: { tag: actionTag || 'New Lead' }
      });
    } else if (actionType === 'AI_REPLY') {
      newSteps.push({
        id: '1',
        action: 'AI_REPLY',
        params: { strategy: 'AUTO_CONSULTANT' }
      });
    }

    await addAutomation({
      name: name.trim(),
      description: description.trim() || `Auto-responder triggered on ${triggerType}`,
      enabled: true,
      trigger: {
        type: triggerType,
        keyword: triggerType === 'KEYWORD' ? keyword.trim() : undefined
      },
      steps: newSteps
    });

    setName('');
    setDescription('');
    setKeyword('');
    setActionText('');
    setActionTag('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {initialMode === 'chatbots' ? 'Keyword Chatbot Auto-Responders' : 'Automation Workflow Builder'}
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Trigger-Action Engine
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inbound WhatsApp keywords (e.g., "PRICE", "CATALOGUE", "RATE") par instant auto-replies, dynamic message flows, aur agent routing set karein.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({automations.length})
            </button>
            <button
              onClick={() => setFilterType('keyword')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === 'keyword' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Keywords ({automations.filter(a => a.trigger?.type === 'KEYWORD').length})
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Workflow
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      {automations.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Koi Automation ya Keyword Chatbot Configured Nahi Hai</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Aapka workspace abhi <strong>100% clean aur blank</strong> hai. Jab koi customer ya dealer aapke connected WhatsApp par keyword bhejega (jaise "PRICE", "CATALOGUE", "SAMPLE"), to instant automatic reply bhejne ke liye apna pehla chatbot banayein.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Keyword Chatbot</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List Column */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Configured Workflows ({filteredWorkflows.length})</span>
            </div>

            {filteredWorkflows.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                Is category me koi workflow nahi mila.
              </div>
            ) : (
              filteredWorkflows.map(auto => {
                const isSelected = selectedWorkflow?.id === auto.id;
                return (
                  <div
                    key={auto.id}
                    onClick={() => setSelectedWorkflowId(auto.id)}
                    className={`p-4 rounded-2xl bg-slate-900 border transition cursor-pointer space-y-2.5 ${
                      isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-white truncate">{auto.name}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAutomation(auto.id);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            auto.enabled
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {auto.enabled ? 'ACTIVE' : 'PAUSED'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete workflow "${auto.name}"?`)) {
                              deleteAutomation(auto.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 transition"
                          title="Delete Workflow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{auto.description}</p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Trigger: <strong className="text-emerald-400 font-mono">{auto.trigger?.type || 'KEYWORD'}</strong></span>
                      <span>{auto.runsCount || 0} hits</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Visual Workflow Canvas View */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col">
            {selectedWorkflow ? (
              <>
                <div className="flex items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{selectedWorkflow.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedWorkflow.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">Status:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedWorkflow.enabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'}`}>
                      {selectedWorkflow.enabled ? 'Live & Listening' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Node Flow Canvas */}
                <div className="py-6 space-y-4 flex-1">
                  {/* 1. TRIGGER NODE */}
                  <div className="relative pl-8">
                    <div className="absolute left-2.5 top-3.5 bottom-0 w-0.5 bg-slate-800"></div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 relative shadow-md">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-emerald-400">
                          <Zap className="w-4 h-4" />
                          <span>TRIGGER: {selectedWorkflow.trigger?.type || 'EVENT'}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded">
                          START
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-300 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        {selectedWorkflow.trigger?.keyword && `Keyword matches: "${selectedWorkflow.trigger.keyword}"`}
                        {selectedWorkflow.trigger?.type === 'CLICK_TO_WHATSAPP' && 'Triggered upon lead clicking Instagram / Facebook Sponsored Ads'}
                        {selectedWorkflow.trigger?.type === 'INCOMING_MESSAGE' && 'Triggered on every inbound WhatsApp customer inquiry'}
                        {!selectedWorkflow.trigger?.keyword && selectedWorkflow.trigger?.type === 'KEYWORD' && 'Listening for inbound matching keywords'}
                      </div>
                    </div>
                  </div>

                  {/* 2. STEPS / ACTION NODES */}
                  {selectedWorkflow.steps && selectedWorkflow.steps.length > 0 ? (
                    selectedWorkflow.steps.map((step, idx) => (
                      <div key={step.id || idx} className="relative pl-8">
                        {idx < (selectedWorkflow.steps?.length || 0) - 1 && (
                          <div className="absolute left-2.5 top-3.5 bottom-0 w-0.5 bg-slate-800"></div>
                        )}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition relative">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 font-bold text-slate-200">
                              {step.action === 'ADD_TAG' && <Tag className="w-4 h-4 text-blue-400" />}
                              {step.action === 'SEND_TEMPLATE' && <Send className="w-4 h-4 text-emerald-400" />}
                              {step.action === 'WAIT_DELAY' && <Clock className="w-4 h-4 text-amber-400" />}
                              {step.action === 'SEND_TEXT' && <Send className="w-4 h-4 text-teal-400" />}
                              {step.action === 'ASSIGN_AGENT' && <UserCheck className="w-4 h-4 text-purple-400" />}
                              {step.action === 'AI_REPLY' && <Bot className="w-4 h-4 text-purple-400" />}
                              {step.action === 'CONDITION_CHECK' && <Filter className="w-4 h-4 text-rose-400" />}
                              <span>STEP {idx + 1}: {step.action}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">NODE_#{step.id || idx + 1}</span>
                          </div>

                          <div className="mt-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                            {step.action === 'ADD_TAG' && `Add tag to contact: "${step.params?.tag}"`}
                            {step.action === 'SEND_TEMPLATE' && `Send WhatsApp Template: "${step.params?.templateName}"`}
                            {step.action === 'WAIT_DELAY' && `Pause workflow for: ${step.params?.durationMinutes || 1} Minutes`}
                            {step.action === 'SEND_TEXT' && `Send Message: "${step.params?.text}"`}
                            {step.action === 'ASSIGN_AGENT' && `Route to agent: ${step.params?.agentName || step.params?.strategy}`}
                            {step.action === 'AI_REPLY' && `Trigger AI Agent: Auto-consultant mode`}
                            {step.action === 'CONDITION_CHECK' && `Check Condition: If ${step.params?.check}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Is workflow me koi step configured nahi hai.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center text-xs text-slate-500">
                Koi workflow select karein details dekhne ke liye.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE WORKFLOW / CHATBOT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>Create New Chatbot / Workflow</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Workflow / Bot Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Catalogue Auto-Sender, Price Inquiry Bot"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Automatically sends tiles catalogue when user types catalogue"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trigger Type</label>
                  <select
                    value={triggerType}
                    onChange={(e: any) => setTriggerType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="KEYWORD">Keyword Match (Chatbot)</option>
                    <option value="INCOMING_MESSAGE">Every New Incoming Chat</option>
                    <option value="CLICK_TO_WHATSAPP">Click-To-WhatsApp Ad Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Action Type</label>
                  <select
                    value={actionType}
                    onChange={(e: any) => setActionType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SEND_TEXT">Send Instant Text Reply</option>
                    <option value="SEND_TEMPLATE">Send WhatsApp Template</option>
                    <option value="ADD_TAG">Add Contact CRM Tag</option>
                    <option value="AI_REPLY">Handover to AI Agent</option>
                  </select>
                </div>
              </div>

              {triggerType === 'KEYWORD' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Matching Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. price, catalogue, sample, rate, enquiry"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Jab customer inme se koi keyword bhejega to turant response trigger hoga.
                  </span>
                </div>
              )}

              {actionType === 'SEND_TEXT' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Automated Message Text</label>
                  <textarea
                    rows={3}
                    required
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    placeholder="e.g. Namaste! Hamara official catalogue dekhne ke liye dhanyawad. Hamari team aapse jaldi sampark karegi."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {actionType === 'SEND_TEMPLATE' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select WhatsApp Template</label>
                  {templates.length > 0 ? (
                    <select
                      value={actionTemplateName}
                      onChange={(e) => setActionTemplateName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.status})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={actionTemplateName}
                      onChange={(e) => setActionTemplateName(e.target.value)}
                      placeholder="e.g. welcome_catalogue_v1"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              )}

              {actionType === 'ADD_TAG' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tag Name</label>
                  <input
                    type="text"
                    required
                    value={actionTag}
                    onChange={(e) => setActionTag(e.target.value)}
                    placeholder="e.g. VIP Dealer, Catalogue Inquired"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition"
                >
                  Save & Activate Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
