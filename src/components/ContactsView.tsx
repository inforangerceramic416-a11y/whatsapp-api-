import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Tag,
  Phone,
  Building,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Contact } from '../types';

export const ContactsView: React.FC = () => {
  const { contacts, segments, addContact, deleteContact, updateContact } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSegmentTab, setActiveSegmentTab] = useState<string>('all');

  // Form states for new contact
  const [formData, setFormData] = useState({
    name: '',
    phone: '+91 ',
    company: '',
    city: 'Morbi',
    country: 'India',
    email: '',
    tags: 'Morbi Dealers',
    leadSource: 'Trade Fair' as const,
    optInStatus: 'OPTED_IN' as const
  });

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags || [])));

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTag !== 'all' && !c.tags.includes(selectedTag)) {
      return false;
    }

    if (activeSegmentTab !== 'all') {
      const segment = segments.find(s => s.id === activeSegmentTab);
      if (segment) {
        if (segment.filterCriteria.tags && !segment.filterCriteria.tags.some(t => c.tags.includes(t))) {
          return false;
        }
        if (segment.filterCriteria.leadSource && c.leadSource !== segment.filterCriteria.leadSource) {
          return false;
        }
      }
    }

    return true;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addContact({
      name: formData.name,
      phone: formData.phone,
      company: formData.company,
      city: formData.city,
      country: formData.country,
      email: formData.email,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      customFields: {},
      leadSource: formData.leadSource,
      optInStatus: formData.optInStatus
    });
    setShowAddModal(false);
    setFormData({
      name: '',
      phone: '+91 ',
      company: '',
      city: 'Morbi',
      country: 'India',
      email: '',
      tags: 'Morbi Dealers',
      leadSource: 'Trade Fair',
      optInStatus: 'OPTED_IN'
    });
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Company', 'City', 'Country', 'Email', 'Tags', 'LeadSource', 'OptInStatus'];
    const rows = filteredContacts.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.company}"`,
      `"${c.city}"`,
      `"${c.country}"`,
      `"${c.email}"`,
      `"${c.tags.join(';')}"`,
      `"${c.leadSource}"`,
      `"${c.optInStatus}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laxtone_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            WhatsApp Contacts CRM
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              {contacts.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tile distributors, architects, builders, and export buyers with verified WhatsApp opt-ins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Segments Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 sm:p-3 flex items-center gap-1.5 sm:gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider pl-1 pr-1.5 flex items-center gap-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> Segments:
        </span>
        <button
          onClick={() => setActiveSegmentTab('all')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium text-xs ${
            activeSegmentTab === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-950/60 text-slate-400 hover:text-white'
          }`}
        >
          All ({contacts.length})
        </button>
        {segments.map(seg => (
          <button
            key={seg.id}
            onClick={() => setActiveSegmentTab(seg.id)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium text-xs ${
              activeSegmentTab === seg.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            {seg.name} ({seg.contactCount})
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, company..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 sm:py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-2 text-xs">
          <span className="text-slate-400 text-xs shrink-0">Tag:</span>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Tags</option>
            {allTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MOBILE RESPONSIVE CONTACTS CARDS (FOR PHONES) */}
      <div className="block lg:hidden space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            No contacts found matching the search.
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{contact.name}</h4>
                  <p className="text-xs text-slate-400">{contact.company || 'Direct Buyer'}</p>
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-emerald-400">{contact.phone}</span>
                <span className="text-slate-400">{contact.city}</span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {contact.tags.map((t, idx) => (
                  <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {contact.optInStatus}
                </span>
                <span>Agent: {contact.assignedAgentName || 'Unassigned'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP CONTACTS TABLE (FOR TABLETS & COMPUTERS) */}
      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Contact & Company</th>
                <th className="py-3.5 px-4">WhatsApp Phone</th>
                <th className="py-3.5 px-4">City / Region</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Opt-In Status</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No contacts found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-white text-xs">{contact.name}</div>
                        <div className="text-[11px] text-slate-400">{contact.company || 'Individual Buyer'}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                      {contact.phone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {contact.city}, {contact.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {contact.tags.map((t, idx) => (
                          <span key={idx} className="bg-slate-800 border border-slate-700/60 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-blue-950/40 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                        {contact.leadSource}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        {contact.optInStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {contact.assignedAgentName || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                        title="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New WhatsApp Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 90000 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Morbi Ceramics Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Ahmedabad"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="India"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Morbi Dealers, Architect, Wholesale"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md shadow-emerald-950/40"
                >
                  Save to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
