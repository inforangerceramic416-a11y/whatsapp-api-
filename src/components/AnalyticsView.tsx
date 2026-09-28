import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCheck,
  Eye,
  Send,
  Users,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { campaigns, conversations, contacts } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Analytics & Conversation Intelligence
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Aggregated Metrics
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time delivery rates, response times, campaign conversion metrics, and regional dealer activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['7d', '30d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg uppercase font-semibold transition ${
                  timeRange === range ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Response Time</span>
          <div className="text-2xl font-black text-white mt-1">2.2 Mins</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Top 5% in Morbi Ceramic Hub</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Delivery Success Rate</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">98.8%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct Meta Cloud API Routes</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Customer Read Rate</span>
          <div className="text-2xl font-black text-purple-400 mt-1">81.4%</div>
          <div className="text-[11px] text-purple-400 mt-0.5">High engagement templates</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Dealer Conversion</span>
          <div className="text-2xl font-black text-teal-400 mt-1">23.6%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Turned into sample/order inquiries</div>
        </div>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">Agent Response Benchmarks</h3>
          <div className="space-y-3 text-xs">
            {[
              { name: 'Amit Shah (Manager)', desk: 'Domestic Distribution', resolved: 48, avgTime: '1.2m' },
              { name: 'Pooja Varma', desk: 'Architect Desk', resolved: 36, avgTime: '2.5m' },
              { name: 'Suresh Prajapati', desk: 'Global Exports', resolved: 22, avgTime: '4.1m' }
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <div className="font-bold text-white">{agent.name}</div>
                  <div className="text-[10px] text-slate-400">{agent.desk}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{agent.avgTime}</div>
                  <div className="text-[10px] text-slate-400">{agent.resolved} chats closed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">Acquisition Channels Performance</h3>
          <div className="space-y-3 text-xs">
            {[
              { source: 'Click-to-WhatsApp (Meta Ads)', leads: 64, conversion: '32%' },
              { source: 'Morbi Trade Fair & ACETECH', leads: 42, conversion: '45%' },
              { source: 'Website E-Catalogue Requests', leads: 29, conversion: '18%' }
            ].map((ch, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <div className="font-bold text-white">{ch.source}</div>
                  <div className="text-[10px] text-slate-400">{ch.leads} total inquiries</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-teal-400">{ch.conversion}</div>
                  <div className="text-[10px] text-slate-400">Order conversion</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
