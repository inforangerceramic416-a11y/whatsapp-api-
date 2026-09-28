import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Database,
  Smartphone,
  Save,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { metaConfig, updateMetaConfig, isRealTimeSynced, clearDemoData } = useApp();
  const [isSaved, setIsSaved] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  const [devMode, setDevMode] = useState(metaConfig.isDemoMode);
  const [coexistenceToggle, setCoexistenceToggle] = useState(metaConfig.coexistenceEnabled);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMetaConfig({
      isDemoMode: devMode,
      coexistenceEnabled: coexistenceToggle
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearDemo = async () => {
    if (window.confirm('Kya aap sure hain ki saare Demo Chats, Messages, Contacts aur Mock Campaigns ko delete karke 100% Clean Blank Production Workspace shuru karna chahte hain?')) {
      setIsClearing(true);
      await clearDemoData();
      setDevMode(false);
      setIsClearing(false);
      setClearedSuccess(true);
      setTimeout(() => setClearedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Settings & Security Compliance
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Enterprise Grade
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Meta Cloud API runtime mode, WhatsApp Coexistence policies, and Firebase Firestore synchronization status.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" /> Settings Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Environment & Mode Switch */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Meta API Execution Mode
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={devMode}
                onChange={() => setDevMode(true)}
                className="w-4 h-4 text-emerald-600 mt-0.5"
              />
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  DEVELOPMENT / MOCK MODE
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded font-mono">RECOMMENDED FOR TESTING</span>
                </div>
                <div className="text-slate-400 mt-1 leading-relaxed">
                  Allows testing all 20 acceptance tests: Shared Inbox replies, Coexistence app echoes, template submissions, AI handover, and broadcasts without deducting Meta conversation billing charges.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={!devMode}
                onChange={() => setDevMode(false)}
                className="w-4 h-4 text-emerald-600 mt-0.5"
              />
              <div>
                <div className="font-bold text-white">REAL META CLOUD API MODE (PRODUCTION)</div>
                <div className="text-slate-400 mt-1 leading-relaxed">
                  Directly dispatches real HTTP calls to <code className="text-emerald-400 font-mono">graph.facebook.com/v21.0</code> using server-side access tokens.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Database & Firestore sync */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            Backend & Real-time Database
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Cloud Firestore Real-time Sync</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE & SYNCED
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every message, template, contact, and webhook event is automatically mirrored into your dedicated Firestore database: <code className="text-slate-200 font-mono">ai-studio-a0343a4b-b86a-48f6-a465-e7525991f2f1</code>.
            </p>
          </div>
        </div>

        {/* Flush Demo Data & Switch to Real Production Card */}
        <div className="bg-gradient-to-r from-red-950/20 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Clean Production Workspace (Clear Demo Data)</span>
            </div>
            {clearedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Demo Data Cleaned! Ready for Live WhatsApp.
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Jab aapka official WhatsApp number connect ho jaye aur aap initial testing kar chuke hon, tab aap 1-click me saari sample chats, mock messages aur demo campaigns ko delete karke <strong>Fresh & Clean Real Inbox</strong> shuru kar sakte hain.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click me saari sample chats, mock messages aur demo records delete hokar 100% blank live workspace ho jayega.
            </div>

            <button
              type="button"
              onClick={handleClearDemo}
              disabled={isClearing}
              className="px-4 py-2 bg-red-900/40 hover:bg-red-800/60 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shrink-0"
            >
              {isClearing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Cleaning Workspace...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Flush Demo Chats & Activate Live Workspace</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
