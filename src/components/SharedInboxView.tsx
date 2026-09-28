import React, { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
  Check,
  Phone,
  User,
  Tag,
  Building,
  MapPin,
  Mail,
  Bot,
  UserCheck,
  Clock,
  Sparkles,
  Smartphone,
  SmartphoneNfc,
  FileText,
  FileCode,
  AlertCircle,
  Plus,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  ArrowLeft,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SharedInboxView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    templates,
    contacts,
    teamMembers,
    assignConversationAgent,
    addInternalNote,
    triggerHumanHandover,
    simulateIncomingCustomerMessage,
    simulateCoexistenceAppEcho
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'assigned' | 'leads' | 'dealers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeContact = contacts.find(c => c.phone === activeConv?.contactPhone);
  const convMessages = messages.filter(m => m.conversationId === activeConv?.id);

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPhone.includes(searchQuery) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'unread') return (c.unreadCount || 0) > 0;
    if (filterTab === 'assigned') return !!c.assignedAgentId;
    if (filterTab === 'leads') return c.tags.some(t => t.toLowerCase().includes('lead') || t.toLowerCase().includes('architect'));
    if (filterTab === 'dealers') return c.tags.some(t => t.toLowerCase().includes('dealer'));
    return true;
  });

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setShowMobileChat(true);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    const txt = inputText;
    setInputText('');
    await sendMessage(txt);
  };

  const handleSendTemplate = async (templateName: string) => {
    const target = templates.find(t => t.name === templateName);
    if (!target) return;
    setShowTemplateModal(false);
    await sendMessage(`[WhatsApp Template: ${target.name}]\n${target.bodyText.replace('{{1}}', activeConv.contactName).replace('{{2}}', 'Morbi Factory')}`);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    await addInternalNote(activeConv.id, noteInput);
    setNoteInput('');
    setShowAddNote(false);
  };

  const handleAssignAgent = async (agentId: string) => {
    const agent = teamMembers.find(t => t.id === agentId);
    if (agent && activeConv) {
      await assignConversationAgent(activeConv.id, agent.id, agent.name);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-6rem)] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* 1. LEFT COLUMN: Conversation List & Filters (Hidden on mobile if chat is open) */}
      <div
        className={`w-full lg:w-80 border-r border-slate-800 flex flex-col shrink-0 bg-slate-900/60 ${
          showMobileChat ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {/* Inbox Header & Search */}
        <div className="p-3 border-b border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              WhatsApp Inbox
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                Official API
              </span>
            </h3>

            {/* Quick simulation buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => simulateIncomingCustomerMessage()}
                title="Simulate Inbound Customer Message"
                className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px]">Test Msg</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, contacts..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sub tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium text-slate-400">
            {(['all', 'unread', 'assigned', 'dealers', 'leads'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition ${
                  filterTab === tab
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-950/60 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No conversations match your search</div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3 cursor-pointer transition flex items-start gap-3 select-none ${
                    isSelected ? 'bg-slate-800/90 border-l-4 border-l-emerald-500' : 'hover:bg-slate-900/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.contactAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={conv.contactName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    {conv.isCoexistenceActive && (
                      <span
                        title="Synced with WhatsApp Business App on Mobile"
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white"
                      >
                        <Smartphone className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white truncate">{conv.contactName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTimestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1 truncate">
                        {conv.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium truncate">
                            {t}
                          </span>
                        ))}
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. MIDDLE COLUMN: Active Chat Panel (Full width on mobile when chat is selected) */}
      <div
        className={`flex-1 flex flex-col bg-slate-950 relative min-w-0 ${
          showMobileChat ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {!activeConv ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
              <SmartphoneNfc className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="font-bold text-base text-white">Live Official WhatsApp Inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aapka clean production workspace ready hai. Jaise hi koi customer ya dealer aapke connected WhatsApp number par message bhejega, uski chat yahan real-time me show hogi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => simulateIncomingCustomerMessage('Namaste! Mujhe 600x1200mm GVT tiles ka quotation chahiye.')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Plus className="w-4 h-4" />
                <span>Simulate Inbound Message</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 px-3 lg:px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Back button for mobile view */}
            <button
              onClick={() => setShowMobileChat(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Back to Chats List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <img
              src={activeConv?.contactAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={activeConv?.contactName}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">{activeConv?.contactName}</h3>
                <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline truncate">{activeConv?.contactPhone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                <span className="truncate">{activeConv?.assignedAgentName || 'Unassigned'}</span>
                {activeConv?.aiAssisted && (
                  <span className="text-purple-400 font-semibold">• AI</span>
                )}
                {activeConv?.aiHandover && (
                  <span className="text-amber-400 font-bold">• Human Handover</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Chat Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium flex items-center gap-1 transition text-xs"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Send Template</span>
            </button>

            <button
              onClick={() => simulateCoexistenceAppEcho()}
              title="Simulate Mobile Echo"
              className="p-1.5 sm:px-3 sm:py-1.5 bg-teal-950/50 hover:bg-teal-900/50 text-teal-300 border border-teal-500/30 rounded-xl font-medium flex items-center gap-1 transition text-xs"
            >
              <SmartphoneNfc className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Echo</span>
            </button>

            {/* Mobile Contact details toggle */}
            <button
              onClick={() => setShowMobileDetails(!showMobileDetails)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Contact Info"
            >
              <Info className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Coexistence notification banner */}
        <div className="bg-emerald-950/30 border-b border-emerald-500/10 px-3 py-1 flex items-center justify-between text-[10px] text-emerald-300">
          <div className="flex items-center gap-1.5 truncate">
            <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">Coexistence Active: Mobile App & Panel sync in real-time.</span>
          </div>
          <span className="font-mono text-[9px] text-slate-400 shrink-0 hidden sm:inline">Meta v21.0</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
          {convMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Bot className="w-8 h-8 text-slate-600 mb-2" />
              <span>No messages yet. Send a WhatsApp message or template below.</span>
            </div>
          ) : (
            convMessages.map((msg) => {
              const isMe = msg.sender === 'business';
              const isBot = msg.sender === 'bot';
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  {/* Sender label */}
                  <span className="text-[9px] text-slate-400 mb-0.5 px-1 flex items-center gap-1">
                    {msg.senderName}
                    {msg.isEchoFromApp && (
                      <span className="bg-teal-900/60 text-teal-300 px-1 rounded text-[8px] font-mono">
                        📱 Phone Echo
                      </span>
                    )}
                  </span>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-2.5 sm:p-3 shadow-md text-xs relative ${
                      isUser
                        ? 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/60'
                        : isBot
                        ? 'bg-gradient-to-r from-purple-950 to-slate-800 text-purple-100 border border-purple-500/30 rounded-tr-sm'
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                    }`}
                  >
                    {/* Media render if document/image */}
                    {msg.type === 'document' && (
                      <div className="bg-black/20 p-2 rounded-xl mb-1.5 flex items-center gap-2 border border-white/10">
                        <FileText className="w-4 h-4 text-emerald-300 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-[11px] truncate">{msg.mediaFileName || 'Document.pdf'}</p>
                          <p className="text-[9px] text-slate-300">Meta Media Attachment</p>
                        </div>
                      </div>
                    )}

                    {/* Text body */}
                    <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.text || msg.mediaCaption}</p>

                    {/* Timestamp & Status */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-sky-300" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-2 sm:p-3 border-t border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition"
              title="Insert WhatsApp Template"
            >
              <FileCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                sendMessage('', {
                  type: 'document',
                  url: 'https://laxtoneceramic.com/docs/Laxtone_2026_Master_Catalogue.pdf',
                  fileName: 'Laxtone_Luxury_Carving_2026_Catalogue.pdf',
                  caption: 'Official 2026 Carving & Matte Vitrified Slabs Spec Sheet'
                });
              }}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition hidden sm:inline-block"
              title="Send Tile Catalogue PDF"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv?.contactName || 'customer'}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-lg shadow-emerald-950/50 transition shrink-0"
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
          </>
        )}
      </div>

      {/* 3. RIGHT COLUMN: Contact CRM Sidebar & Notes (Hidden on mobile unless toggled) */}
      <div
        className={`w-full sm:w-80 border-l border-slate-800 flex-col shrink-0 bg-slate-900/90 lg:bg-slate-900/60 overflow-y-auto ${
          showMobileDetails ? 'fixed lg:static inset-y-0 right-0 z-40 flex shadow-2xl' : 'hidden lg:flex'
        }`}
      >
        {/* Mobile close bar */}
        <div className="lg:hidden p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <span className="font-bold text-xs text-white">Contact Details & CRM</span>
          <button
            onClick={() => setShowMobileDetails(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={activeConv?.contactAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={activeConv?.contactName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 shrink-0"
            />
            <div className="overflow-hidden min-w-0">
              <h4 className="font-bold text-sm text-white truncate">{activeConv?.contactName}</h4>
              <p className="text-xs text-emerald-400 font-mono truncate">{activeConv?.contactPhone}</p>
              <p className="text-[11px] text-slate-400 truncate">{activeContact?.company || 'Ceramic Dealer / Client'}</p>
            </div>
          </div>

          {/* Opt-in status badge */}
          <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400">Opt-in Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {activeContact?.optInStatus || 'OPTED_IN'}
            </span>
          </div>
        </div>

        {/* Agent Assignment Dropdown */}
        <div className="p-4 border-b border-slate-800 space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Assigned Sales Agent
          </label>
          <select
            value={activeConv?.assignedAgentId || ''}
            onChange={(e) => handleAssignAgent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Unassigned</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.assignedDepartment})
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="p-4 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Contact Tags</span>
            <Tag className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeConv?.tags.map((t, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-200 border border-slate-700/60 px-2 py-0.5 rounded-lg">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Custom Ceramic Fields */}
        {activeContact?.customFields && (
          <div className="p-4 border-b border-slate-800 space-y-2 text-xs">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tile Specifications
            </label>
            <div className="space-y-1.5">
              {Object.entries(activeContact.customFields).map(([k, v]) => (
                <div key={k} className="flex justify-between bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-slate-200 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Team Notes */}
        <div className="p-4 space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Internal Team Notes</h5>
            <button
              onClick={() => setShowAddNote(!showAddNote)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Note
            </button>
          </div>

          {showAddNote && (
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write private internal note for team..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="px-2.5 py-1 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {activeConv?.notes && activeConv.notes.length > 0 ? (
              activeConv.notes.map((n) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">{n.author}</span>
                    <span>{n.createdAt}</span>
                  </div>
                  <p className="text-slate-200">{n.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No internal notes for this conversation.</p>
            )}
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Select Approved WhatsApp Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {templates
                .filter(t => t.status === 'APPROVED')
                .map(tmpl => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSendTemplate(tmpl.name)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-400">{tmpl.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{tmpl.bodyText}</p>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
