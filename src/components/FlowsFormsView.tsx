import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  ExternalLink,
  Code,
  Smartphone,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FlowsFormsView: React.FC = () => {
  const { flows, forms } = useApp();
  const [selectedFlow, setSelectedFlow] = useState(flows[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            WhatsApp Flows & Interactive Forms
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Meta Flows 5.0
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build native multi-screen in-chat WhatsApp forms for dealer KYC registration, factory visit appointments, and sample box requests.
          </p>
        </div>
      </div>

      {/* Grid: Flows List + JSON & Screen Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active WhatsApp Flows
          </div>
          {flows.map(fl => {
            const isSelected = selectedFlow?.id === fl.id;
            return (
              <div
                key={fl.id}
                onClick={() => setSelectedFlow(fl)}
                className={`p-4 rounded-2xl bg-slate-900 border transition cursor-pointer space-y-2 ${
                  isSelected ? 'border-emerald-500 shadow-md shadow-emerald-950/30' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{fl.name}</h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    {fl.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{fl.screensCount} Native Screens</span>
                  <span>•</span>
                  <span>{fl.categories.join(', ')}</span>
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              WhatsApp Web Forms
            </div>
            {forms.map(fm => (
              <div key={fm.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-slate-200">{fm.title}</div>
                <div className="text-slate-400 text-[11px]">{fm.submissionsCount} dealer submissions</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Flow Screens & JSON Structure */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">{selectedFlow?.name}</h3>
              <p className="text-xs text-slate-400">Meta Native WhatsApp Flow JSON Payload Definition</p>
            </div>
            <span className="text-xs bg-slate-950 border border-slate-800 text-emerald-400 font-mono px-2 py-1 rounded">
              Flows Engine v5.0
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-emerald-400 text-xs overflow-x-auto whitespace-pre">
            {JSON.stringify(JSON.parse(selectedFlow?.jsonDefinition || '{}'), null, 2)}
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Form submissions automatically create contacts in the CRM and trigger the Instant Catalogue Workflow.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
