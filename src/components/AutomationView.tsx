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
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AutomationView: React.FC = () => {
  const { automations, toggleAutomation } = useApp();
  const [selectedWorkflow, setSelectedWorkflow] = useState(automations[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Automation Workflow Builder
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Visual Trigger-Action Engine
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build multi-step automated journeys: trigger on inbound keywords (e.g., "CATALOGUE"), route to agents, send PDFs, and handover to AI.
          </p>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Workflows ({automations.length})
          </div>

          {automations.map(auto => {
            const isSelected = selectedWorkflow?.id === auto.id;
            return (
              <div
                key={auto.id}
                onClick={() => setSelectedWorkflow(auto)}
                className={`p-4 rounded-2xl bg-slate-900 border transition cursor-pointer space-y-2 ${
                  isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white truncate">{auto.name}</h4>
                  <button
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
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{auto.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Trigger: <strong className="text-emerald-400 font-mono">{auto.trigger.type}</strong></span>
                  <span>{auto.runsCount} executions</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Workflow Canvas View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">{selectedWorkflow?.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedWorkflow?.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedWorkflow?.enabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'}`}>
                {selectedWorkflow?.enabled ? 'Live & Listening' : 'Disabled'}
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
                    <span>TRIGGER: {selectedWorkflow?.trigger.type}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded">
                    START
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-300 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  {selectedWorkflow?.trigger.keyword && `Keyword matches: "${selectedWorkflow.trigger.keyword}"`}
                  {selectedWorkflow?.trigger.type === 'CLICK_TO_WHATSAPP' && 'Triggered upon lead clicking Instagram / Facebook Sponsored Ads'}
                  {selectedWorkflow?.trigger.type === 'INCOMING_MESSAGE' && 'Triggered on every inbound WhatsApp customer inquiry'}
                </div>
              </div>
            </div>

            {/* 2. STEPS / ACTION NODES */}
            {selectedWorkflow?.steps.map((step, idx) => (
              <div key={step.id} className="relative pl-8">
                {idx < selectedWorkflow.steps.length - 1 && (
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
                    <span className="text-[10px] text-slate-500 font-mono">NODE_#{step.id}</span>
                  </div>

                  <div className="mt-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {step.action === 'ADD_TAG' && `Add tag to contact: "${step.params.tag}"`}
                    {step.action === 'SEND_TEMPLATE' && `Send WhatsApp Template: "${step.params.templateName}"`}
                    {step.action === 'WAIT_DELAY' && `Pause workflow for: ${step.params.durationMinutes} Minutes`}
                    {step.action === 'SEND_TEXT' && `Send Message: "${step.params.text}"`}
                    {step.action === 'ASSIGN_AGENT' && `Route to agent: ${step.params.agentName || step.params.strategy}`}
                    {step.action === 'AI_REPLY' && `Trigger AI Agent: Auto-consultant mode`}
                    {step.action === 'CONDITION_CHECK' && `Check Condition: If ${step.params.check}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
