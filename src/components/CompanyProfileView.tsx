import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CompanyProfileView: React.FC = () => {
  const { companyProfile, updateCompanyProfile } = useApp();
  const [profile, setProfile] = useState(companyProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Laxtone Ceramic - Business Profile
            <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
              Morbi Ceramic Cluster
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your verified manufacturer details, GSTIN, factory address, and decorative tile product catalogue categories.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" /> Profile Updated & Synced to Meta WABA
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Details Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Official Meta WhatsApp Business Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company / Brand Name *</label>
              <input
                type="text"
                required
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Industry Sector *</label>
              <input
                type="text"
                required
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Website</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Support Phone</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Manufacturing Plant & Showroom Address</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">About Company / WhatsApp Description</label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </div>

        {/* Product Catalogue Categories */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
            <Layers className="w-4 h-4 text-emerald-400" />
            Manufactured Tile Categories
          </h3>
          <p className="text-xs text-slate-400">
            These product categories are used by the AI Agent and catalog flows when dealers inquire on WhatsApp.
          </p>

          <div className="space-y-2">
            {profile.productCategories.map((cat, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{cat}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs mt-4">
            Directly accessible to verified architects and dealers requesting PDFs in the Shared Inbox.
          </div>
        </div>
      </form>
    </div>
  );
};
