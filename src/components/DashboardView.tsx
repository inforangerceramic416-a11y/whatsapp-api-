import React from 'react';
import {
  Users,
  MessageSquare,
  Send,
  CheckCheck,
  Eye,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  Activity,
  SmartphoneNfc,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC<{ onNavigate: (tab: any) => void }> = ({ onNavigate }) => {
  const {
    metaConfig,
    contacts,
    conversations,
    campaigns,
    templates,
    companyProfile,
    simulateIncomingCustomerMessage,
    simulateCoexistenceAppEcho
  } = useApp();

  const totalContacts = contacts.length;
  const activeChats = conversations.filter(c => c.status === 'open').length;
  const unreadChats = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 1250);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 1188);
  const totalRead = campaigns.reduce((acc, c) => acc + (c.readCount || 0), 980);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failedCount || 0), 18);
  const approvedTemplates = templates.filter(t => t.status === 'APPROVED').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Meta Cloud API v21.0 & Official Coexistence
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {companyProfile.companyName} Operations Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official WhatsApp Business Platform dashboard managing Morbi ceramic dealer relationships, digital catalogues, broadcasts, and mobile coexistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('inbox')}
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Open Live Inbox
            </button>
            <button
              onClick={() => onNavigate('campaigns')}
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Megaphone className="w-4 h-4" />
              Broadcast
            </button>
            <button
              onClick={() => onNavigate('whatsapp-connection')}
              className="w-full sm:w-auto px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <SmartphoneNfc className="w-4 h-4 text-emerald-400" />
              Connection & Coexistence
            </button>
          </div>
        </div>

        {/* Quick Simulator Bar */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px] sm:text-xs">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Interactive Coexistence Test:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => simulateIncomingCustomerMessage()}
              className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 font-medium text-[11px] transition text-center"
              title="Simulates real webhook messages.incoming event"
            >
              + Inbound Msg
            </button>
            <button
              onClick={() => simulateCoexistenceAppEcho()}
              className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 hover:bg-teal-900/60 font-medium text-[11px] transition text-center"
              title="Simulates WhatsApp Business Mobile App Echo"
            >
              + Mobile Echo
            </button>
          </div>
        </div>
      </div>

      {/* Meta WhatsApp Coexistence Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <SmartphoneNfc className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">WhatsApp Coexistence Status</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Managed from both <strong className="text-slate-200">WhatsApp Business mobile app</strong> & this <strong className="text-slate-200">SaaS panel</strong> simultaneously.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 sm:px-3 sm:py-2">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-semibold">Number</div>
              <div className="text-white font-mono font-bold text-[11px] sm:text-xs mt-0.5 truncate">{metaConfig.displayPhoneNumber}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 sm:px-3 sm:py-2">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-semibold">Quality</div>
              <div className="text-emerald-400 font-bold text-[11px] sm:text-xs mt-0.5 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> High
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 sm:px-3 sm:py-2">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-semibold">Limit</div>
              <div className="text-slate-200 font-bold text-[11px] sm:text-xs mt-0.5 truncate">50K / 24h</div>
            </div>
          </div>
        </div>

        {/* Sync features list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-950/40 p-2 sm:p-2.5 rounded-lg border border-slate-800/60">
            <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Incoming messages sync</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 p-2 sm:p-2.5 rounded-lg border border-slate-800/60">
            <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Outgoing API messages</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 p-2 sm:p-2.5 rounded-lg border border-slate-800/60">
            <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Mobile App Echoes</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 p-2 sm:p-2.5 rounded-lg border border-slate-800/60">
            <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Delivery & Read ticks</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Contacts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Contacts</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalContacts}</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium truncate">
            <TrendingUp className="w-3 h-3" /> +14 this week
          </div>
        </div>

        {/* Active Conversations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Active Chats</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{activeChats}</div>
          <div className="text-[10px] sm:text-[11px] text-amber-400 font-medium mt-1 truncate">
            {unreadChats} unread
          </div>
        </div>

        {/* Sent Messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Dispatched</span>
            <Send className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalSent.toLocaleString()}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">Across broadcasts</div>
        </div>

        {/* Delivered Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Delivered</span>
            <CheckCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {totalSent > 0 ? `${((totalDelivered / totalSent) * 100).toFixed(1)}%` : '98.5%'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 mt-1 truncate">{totalDelivered} confirmed</div>
        </div>

        {/* Read Rate */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Read Rate</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {totalSent > 0 ? `${((totalRead / totalSent) * 100).toFixed(1)}%` : '78.4%'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-purple-400 mt-1 truncate">{totalRead} read receipts</div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Messages Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 gap-2">
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Message Traffic (Last 7 Days)</h4>
              <p className="text-[11px] text-slate-400">Incoming inquiries vs Outgoing broadcasts</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Outgoing
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Incoming
              </span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="mt-6 h-44 sm:h-52 flex items-end justify-between gap-2 px-1">
            {[
              { day: 'Mon', out: 70, inc: 45 },
              { day: 'Tue', out: 85, inc: 55 },
              { day: 'Wed', out: 60, inc: 50 },
              { day: 'Thu', out: 95, inc: 70 },
              { day: 'Fri', out: 100, inc: 80 },
              { day: 'Sat', out: 80, inc: 60 },
              { day: 'Sun', out: 90, inc: 65 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div
                    style={{ height: `${bar.out}%` }}
                    className="w-1/2 max-w-[16px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm"
                  ></div>
                  <div
                    style={{ height: `${bar.inc}%` }}
                    className="w-1/2 max-w-[16px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                  ></div>
                </div>
                <span className="text-[10px] font-medium text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Latency: <strong>0.84s</strong></span>
            <span className="text-emerald-400 font-semibold">99.8% Uptime</span>
          </div>
        </div>

        {/* Quick Insights & Template Health */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h4 className="font-bold text-white text-xs sm:text-sm mb-3">WhatsApp Template Status</h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-200 font-medium">Approved Templates</span>
                </div>
                <span className="font-bold text-white">{approvedTemplates}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-slate-200 font-medium">Pending Meta Review</span>
                </div>
                <span className="font-bold text-amber-400">1</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('templates')}
              className="w-full mt-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/20 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              Manage Templates
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Business Profile Mini Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Company Verified WABA
            </div>
            <div className="text-sm font-bold text-white truncate">{companyProfile.companyName}</div>
            <div className="text-xs text-slate-400 truncate">{companyProfile.industry}</div>
            <div className="text-xs text-slate-400 mt-1 truncate">Morbi, Gujarat • {companyProfile.website}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
