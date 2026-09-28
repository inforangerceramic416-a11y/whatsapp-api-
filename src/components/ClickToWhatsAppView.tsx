import React, { useState } from 'react';
import {
  MousePointerClick,
  Plus,
  TrendingUp,
  Tag,
  CheckCircle2,
  ExternalLink,
  Users,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ClickToWhatsAppView: React.FC = () => {
  const { ctwaLeads, automations } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Click-to-WhatsApp (CTWA) Lead Tracking
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Meta Ads Attribution
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track leads arriving directly from Instagram Reels and Facebook Sponsored Ads, capture first messages, and route instantly to Morbi sales desks.
          </p>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total CTWA Ad Leads</span>
          <div className="text-2xl font-black text-white mt-1">{ctwaLeads.length * 32}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">+28% vs last month</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Response Time</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">1.4 mins</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Automated AI qualification</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Cost Per Inbound Lead</span>
          <div className="text-2xl font-black text-blue-400 mt-1">₹42.50</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Meta Campaign ROAS 4.8x</div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Recent Inbound Ad Leads</h3>
          <span className="text-xs text-slate-400">Synced via Meta Marketing API</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Meta Ad Campaign</th>
                <th className="py-3 px-4">Source Channel</th>
                <th className="py-3 px-4">First Inbound Message</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ctwaLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{lead.customerName}</div>
                    <div className="text-[11px] font-mono text-emerald-400">{lead.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{lead.adName}</div>
                    <div className="text-[10px] text-slate-400">{lead.campaignName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {lead.adSource}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 italic max-w-xs truncate">
                    "{lead.firstMessage}"
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {lead.assignedAgent}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
