import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Tag,
  Send,
  Building2,
  MapPin,
  Smartphone,
  Mail,
  Lock,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertTriangle,
  Radio,
  FileCode2,
  UserCheck
} from 'lucide-react';

export const MasterControlPanelView: React.FC = () => {
  const {
    allUsers,
    systemVersion,
    currentUser,
    approveUser,
    rejectUser,
    publishSystemUpdate,
    metaConfig
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'version' | 'system'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Publish update form state
  const [newReleaseNotes, setNewReleaseNotes] = useState('');
  const [globalNotice, setGlobalNotice] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filtered users
  const pendingUsers = allUsers.filter(u => u.status === 'pending');
  const approvedUsers = allUsers.filter(u => u.status === 'approved' && u.role !== 'master');

  const filteredPending = pendingUsers.filter(u =>
    u.mobile.includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.businessName && u.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredApproved = approvedUsers.filter(u =>
    u.mobile.includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.businessName && u.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReleaseNotes.trim()) return;
    setIsPublishing(true);
    try {
      await publishSystemUpdate(newReleaseNotes.trim(), globalNotice.trim() || undefined);
      setPublishSuccess(true);
      setNewReleaseNotes('');
      setGlobalNotice('');
      setTimeout(() => setPublishSuccess(false), 4000);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Master Hub Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-red-400" /> Master Super Admin Control Panel
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {systemVersion.versionCode} (Seq #{systemVersion.sequence})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Master Admin & Multi-Tenant Management Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Yahan se aap sabhi naye signup users ko approve kar sakte hain. Approve karte hi user ko uska <strong>alag fresh panel</strong> milta hai jiska data isolated rehta hai. Jab aap yahan se naya version update publish karenge to sabhi users ke left corner me sequence number ke saath <strong>"{systemVersion.versionCode}"</strong> live sync ho jayega.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center min-w-[100px]">
              <div className="text-xs text-slate-400">Pending Signups</div>
              <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
                {pendingUsers.length}
              </div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center min-w-[100px]">
              <div className="text-xs text-slate-400">Active Tenants</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                {approvedUsers.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-950/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'approved'
              ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Approved Users / Fresh Panels ({approvedUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('version')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'version'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-950/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Publish Version Update ({systemVersion.versionCode})</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by mobile, email, city, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredPending.length} pending request(s)
            </span>
          </div>

          {filteredPending.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white text-sm">Koi naya pending signup request nahi hai</h3>
              <p className="text-xs text-slate-400">
                Jab bhi koi user signup form bharega, uski details yahan turant approve button ke saath aayegi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPending.map((user) => (
                <div
                  key={user.id}
                  className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                          Awaiting Approval
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1.5 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-amber-400" />
                          {user.businessName || 'Fresh Panel User'}
                        </h4>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mobile:</span>
                        <strong className="text-white">{user.mobile}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 truncate">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>City:</span>
                        <strong className="text-white">{user.city}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Tenant ID:</span>
                        <span className="text-slate-300">{user.tenantId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => approveUser(user.id)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Grant Panel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectUser(user.id)}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 rounded-xl text-xs font-semibold transition"
                      title="Reject Signup"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVED USERS / FRESH PANELS */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search approved active users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Total {filteredApproved.length} active tenant(s)
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 sm:px-4">Business / User</th>
                    <th className="p-3.5 sm:px-4">Mobile & Login</th>
                    <th className="p-3.5 sm:px-4">City</th>
                    <th className="p-3.5 sm:px-4">Tenant Scope</th>
                    <th className="p-3.5 sm:px-4">Approval Date</th>
                    <th className="p-3.5 sm:px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {filteredApproved.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 sm:px-4 font-sans font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.businessName ? u.businessName.slice(0, 2).toUpperCase() : 'US'}
                          </div>
                          <div>
                            <div>{u.businessName || 'Fresh Panel Account'}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 sm:px-4 text-emerald-400 font-bold">
                        {u.mobile}
                      </td>
                      <td className="p-3.5 sm:px-4 font-sans">
                        {u.city}
                      </td>
                      <td className="p-3.5 sm:px-4 text-slate-400 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {u.tenantId}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4 text-slate-500 text-[11px]">
                        {u.approvedAt ? new Date(u.approvedAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="p-3.5 sm:px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Fresh Panel Live
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredApproved.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                        Koi approved user nahi mila.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISH VERSION UPDATE */}
      {activeTab === 'version' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Live Version Indicator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 h-fit">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              Currently Deployed Version
            </span>
            <div>
              <div className="text-3xl font-black text-white font-mono tracking-tight text-emerald-400">
                {systemVersion.versionCode}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Global Sequence Number: <strong>#{systemVersion.sequence}</strong>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-200">Current Release Notes:</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {systemVersion.releaseNotes}
              </p>
              {systemVersion.globalNotice && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                  <strong>Notice:</strong> {systemVersion.globalNotice}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div>Last Published: {new Date(systemVersion.updatedAt).toLocaleString()}</div>
              <div>Published By: {systemVersion.updatedBy}</div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300">
              💡 Yeh sequence number sabhi active users ke left sidebar corner me real-time Firestore sync ke zariye bina reload kare update hoga.
            </div>
          </div>

          {/* Form to Publish New Version */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Publish Global Panel Update to All Users
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Yahan se aap jo bhi update ya changes publish karenge, system ka sequence automatically next 4-digit number (e.g. <strong>ver - {systemVersion.sequence + 1}</strong>) me increment ho jayega aur sabhi users ko instantly receive hoga.
              </p>
            </div>

            {publishSuccess && (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Update published successfully! All connected user panels updated to <strong>ver - {systemVersion.sequence}</strong> in real-time.
                </span>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Update Release Notes / Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReleaseNotes}
                  onChange={(e) => setNewReleaseNotes(e.target.value)}
                  placeholder="Jaise: WhatsApp Coexistence v21 update added, new templates layout, broadcast speed boost, bug fixes..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Broadcast Global Notice to Users (Optional Banner)
                </label>
                <input
                  type="text"
                  value={globalNotice}
                  onChange={(e) => setGlobalNotice(e.target.value)}
                  placeholder="Jaise: Server maintenance completed. All broadcast lines running at full speed."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-300">Next Automatic Version Code:</div>
                  <div className="text-emerald-400 font-mono font-bold text-sm mt-0.5">
                    ver - {systemVersion.sequence + 1}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isPublishing || !newReleaseNotes.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-950/50 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Publishing Live...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Update to All Panels</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
