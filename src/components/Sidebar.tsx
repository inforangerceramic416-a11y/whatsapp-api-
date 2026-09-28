import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Send,
  FileCode,
  Zap,
  Bot,
  Brain,
  Workflow,
  FileSpreadsheet,
  FolderOpen,
  BarChart3,
  MousePointerClick,
  Layers,
  Webhook,
  Smartphone,
  Settings,
  ShieldCheck,
  Building2,
  RefreshCw,
  SmartphoneNfc,
  X,
  ShieldAlert,
  LogOut,
  Sparkles,
  Link2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type TabType =
  | 'dashboard'
  | 'inbox'
  | 'contacts'
  | 'campaigns'
  | 'templates'
  | 'automation'
  | 'chatbots'
  | 'ai-agent'
  | 'flows'
  | 'forms'
  | 'media'
  | 'analytics'
  | 'ctwa'
  | 'integrations'
  | 'api-webhooks'
  | 'whatsapp-connection'
  | 'company-profile'
  | 'team'
  | 'quick-links'
  | 'settings'
  | 'master-panel';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const {
    metaConfig,
    conversations,
    systemVersion,
    currentUser,
    isMasterLoggedIn,
    allUsers,
    logout,
    setMasterPasswordModalOpen
  } = useApp();

  const unreadChatsCount = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  const pendingApprovalsCount = allUsers.filter(u => u.status === 'pending').length;

  const menuSections: MenuSection[] = [
    ...(isMasterLoggedIn ? [{
      title: 'MASTER ADMINISTRATION',
      items: [
        {
          id: 'master-panel',
          label: 'Master Control Hub',
          icon: ShieldAlert,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          highlight: pendingApprovalsCount > 0
        }
      ]
    }] : []),
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inbox', label: 'Shared Inbox', icon: MessageSquare, badge: unreadChatsCount > 0 ? unreadChatsCount : undefined },
        { id: 'contacts', label: 'Contacts CRM', icon: Users },
        { id: 'campaigns', label: 'Campaigns & Broadcast', icon: Send },
        { id: 'templates', label: 'WhatsApp Templates', icon: FileCode },
      ]
    },
    {
      title: 'INTELLIGENCE & AUTOMATION',
      items: [
        { id: 'automation', label: 'Automation Workflows', icon: Zap },
        { id: 'ai-agent', label: 'AI Agent & Handover', icon: Brain },
        { id: 'chatbots', label: 'Keyword Chatbots', icon: Bot },
        { id: 'flows', label: 'WhatsApp Flows', icon: Workflow },
        { id: 'forms', label: 'WhatsApp Forms', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'GROWTH & ASSETS',
      items: [
        { id: 'ctwa', label: 'Click-to-WhatsApp Ads', icon: MousePointerClick },
        { id: 'media', label: 'Media & Catalogues', icon: FolderOpen },
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
      ]
    },
    {
      title: 'META CONFIGURATION',
      items: [
        { id: 'whatsapp-connection', label: 'WhatsApp Connection', icon: SmartphoneNfc, highlight: true },
        { id: 'api-webhooks', label: 'API & Webhooks', icon: Webhook },
        { id: 'company-profile', label: 'Laxtone Ceramic Profile', icon: Building2 },
        { id: 'team', label: 'Team & Agents', icon: ShieldCheck },
        { id: 'quick-links', label: 'Quick Links', icon: Link2, highlight: true },
        { id: 'settings', label: 'Settings & Security', icon: Settings },
      ]
    }
  ];

  const handleSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 lg:w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen shrink-0 select-none transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white font-bold text-lg ring-1 ring-emerald-400/30">
              LX
            </div>
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-sm text-slate-100 tracking-tight truncate flex items-center gap-1.5">
                LAXTONE CERAMIC
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Meta Cloud API v21.0
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Coexistence pill */}
        <div className="px-4 py-2 border-b border-slate-800/50 bg-slate-950/40">
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium text-[11px] truncate font-mono">{metaConfig.displayPhoneNumber}</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded shrink-0">
              COEXIST
            </span>
          </div>
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as TabType)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                          isActive ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-slate-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom User Profile & Live System Version Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 text-xs space-y-2.5">
          {/* User profile info & logout */}
          {currentUser && (
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isMasterLoggedIn ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isMasterLoggedIn ? 'MA' : currentUser.businessName?.slice(0, 2).toUpperCase() || 'US'}
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-[11px] font-bold text-white truncate">
                    {currentUser.businessName || 'Workspace User'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {currentUser.mobile}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition shrink-0"
                title="Logout from Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Master Defined Live Version in Left Corner */}
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5" title={`Release: ${systemVersion.releaseNotes}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {/* REPLACED 'Firestore Synced' TEXT WITH 'ver - 4 digit no' */}
              <span className="text-[11px] font-bold font-mono text-emerald-400 tracking-wide bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {systemVersion.versionCode || `ver - ${systemVersion.sequence}`}
              </span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
              metaConfig.status === 'CONNECTED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {metaConfig.status === 'CONNECTED' ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
