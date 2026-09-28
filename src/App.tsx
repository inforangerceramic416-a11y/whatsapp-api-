import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SharedInboxView } from './components/SharedInboxView';
import { ContactsView } from './components/ContactsView';
import { TemplatesView } from './components/TemplatesView';
import { CampaignsView } from './components/CampaignsView';
import { AutomationView } from './components/AutomationView';
import { AIAgentView } from './components/AIAgentView';
import { WhatsAppConnectionView } from './components/WhatsAppConnectionView';
import { CompanyProfileView } from './components/CompanyProfileView';
import { ApiWebhooksView } from './components/ApiWebhooksView';
import { TeamView } from './components/TeamView';
import { ClickToWhatsAppView } from './components/ClickToWhatsAppView';
import { MediaView } from './components/MediaView';
import { FlowsFormsView } from './components/FlowsFormsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { MasterControlPanelView } from './components/MasterControlPanelView';
import { QuickLinksView } from './components/QuickLinksView';
import {
  Menu,
  SmartphoneNfc,
  Building2,
  MessageSquare,
  Users,
  Send,
  LayoutDashboard,
  AlertTriangle,
  ShieldAlert,
  KeyRound,
  LogOut,
  Sparkles,
  Lock,
  X
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('whatsapp-connection');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    metaConfig,
    conversations,
    isAuthenticated,
    isMasterLoggedIn,
    currentUser,
    systemVersion,
    logout,
    verifyMasterPanelPassword,
    isMasterPanelUnlocked,
    impersonatingFromMaster,
    returnToMaster
  } = useApp();

  // Master open password modal state (pass: 123456789)
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [masterPasswordError, setMasterPasswordError] = useState(false);

  const isConnected = metaConfig.status === 'CONNECTED' && Boolean(metaConfig.phoneNumberId && metaConfig.wabaId);

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('navigate-tab', handleNav);
    return () => window.removeEventListener('navigate-tab', handleNav);
  }, []);

  // When master logs in, default to master-panel
  useEffect(() => {
    if (isMasterLoggedIn && activeTab !== 'master-panel') {
      setActiveTab('master-panel');
    }
  }, [isMasterLoggedIn]);

  // If user is not authenticated, show Signup/Login modal
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  // Handle Master panel click with password protection (123456789)
  const handleTabSelect = (tab: TabType) => {
    if (tab === 'master-panel' && isMasterLoggedIn && !isMasterPanelUnlocked) {
      // Trigger password prompt
      setActiveTab('master-panel');
      return;
    }
    setActiveTab(tab);
  };

  const handleVerifyMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyMasterPanelPassword(masterPasswordInput);
    if (!ok) {
      setMasterPasswordError(true);
    } else {
      setMasterPasswordError(false);
      setMasterPasswordInput('');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Top Navbar */}
        <header className="h-14 sm:h-16 border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between bg-slate-950/90 backdrop-blur-md shrink-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
            </button>

            <h2 className="text-sm sm:text-base font-extrabold text-white capitalize tracking-tight truncate flex items-center gap-2">
              {activeTab === 'master-panel' ? 'Master Super Admin Control' : activeTab.replace('-', ' ')}
            </h2>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="truncate">{currentUser?.businessName || metaConfig.businessName}</span>
            </div>

            {/* Global version notice badge */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{systemVersion.versionCode}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Master Hub Switcher button if master */}
            {isMasterLoggedIn && (
              <button
                onClick={() => setActiveTab('master-panel')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition border ${
                  activeTab === 'master-panel'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50'
                    : 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Master Control</span>
              </button>
            )}

            {/* WhatsApp Coexistence status pill */}
            <button
              onClick={() => setActiveTab('whatsapp-connection')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs font-semibold ${
                isConnected
                  ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 animate-pulse'
              }`}
            >
              <SmartphoneNfc className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">WhatsApp API:</span>
              <strong className="font-bold">{isConnected ? 'LIVE' : 'DISCONNECTED'}</strong>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <button
                onClick={() => setActiveTab('company-profile')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition"
                title={currentUser?.email}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                  isMasterLoggedIn ? 'bg-red-600' : 'bg-emerald-600'
                }`}>
                  {isMasterLoggedIn ? 'MA' : currentUser?.businessName?.slice(0, 2).toUpperCase() || 'LX'}
                </div>
                <span className="hidden sm:inline text-slate-300 truncate max-w-[110px]">
                  {currentUser?.city ? `${currentUser.city} Hub` : 'Workspace'}
                </span>
              </button>

              <button
                onClick={logout}
                className="p-2 hover:bg-slate-900 text-slate-400 hover:text-red-400 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* View Router Scroll View */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-20 lg:pb-6 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* MASTER IMPERSONATION BANNER (Jab Master kisi user ka panel inspect kar raha ho) */}
            {impersonatingFromMaster && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-purple-950/80 to-slate-900 border-2 border-red-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>Master Admin Mode: Inspecting User Panel</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/40">
                        {currentUser?.businessName || 'User Account'}
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Aap Master Admin ke roop me is user <strong>({currentUser?.mobile})</strong> ka panel aur settings dekh rahe hain.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    returnToMaster();
                    setActiveTab('master-panel');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition shrink-0"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Return to Master Admin Panel</span>
                </button>
              </div>
            )}

            {/* MASTER PANEL WITH PASSWORD CHECK (PASS: 123456789) */}
            {activeTab === 'master-panel' && (
              isMasterPanelUnlocked ? (
                <MasterControlPanelView />
              ) : (
                <div className="max-w-md mx-auto my-12 bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-base">Enter Master Panel Security Password</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Master Control Panel open karne ke liye secondary security password enter karein.
                    </p>
                  </div>

                  {masterPasswordError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 text-center font-semibold">
                      Invalid Master Security Password! Please try again.
                    </div>
                  )}

                  <form onSubmit={handleVerifyMasterPassword} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        required
                        value={masterPasswordInput}
                        onChange={(e) => setMasterPasswordInput(e.target.value)}
                        placeholder="Enter Master Access Password"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-center text-white font-mono tracking-widest focus:outline-none transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/50 transition flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Unlock Master Panel</span>
                    </button>
                  </form>
                </div>
              )
            )}

            {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
            {activeTab === 'inbox' && <SharedInboxView />}
            {activeTab === 'contacts' && <ContactsView />}
            {activeTab === 'campaigns' && <CampaignsView />}
            {activeTab === 'templates' && <TemplatesView />}
            {activeTab === 'automation' && <AutomationView />}
            {activeTab === 'chatbots' && <AutomationView />}
            {activeTab === 'ai-agent' && <AIAgentView />}
            {activeTab === 'flows' && <FlowsFormsView />}
            {activeTab === 'forms' && <FlowsFormsView />}
            {activeTab === 'media' && <MediaView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'ctwa' && <ClickToWhatsAppView />}
            {activeTab === 'integrations' && <ApiWebhooksView />}
            {activeTab === 'api-webhooks' && <ApiWebhooksView />}
            {activeTab === 'whatsapp-connection' && <WhatsAppConnectionView />}
            {activeTab === 'company-profile' && <CompanyProfileView />}
            {activeTab === 'team' && <TeamView />}
            {activeTab === 'quick-links' && <QuickLinksView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px]">
          <button
            onClick={() => setActiveTab('whatsapp-connection')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition ${
              activeTab === 'whatsapp-connection' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <SmartphoneNfc className="w-4 h-4" />
            <span>Connect</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition ${
              activeTab === 'templates' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition relative ${
              activeTab === 'inbox' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inbox</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition ${
              activeTab === 'contacts' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition ${
              activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
