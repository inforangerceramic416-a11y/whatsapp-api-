import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, seedInitialFirestoreData, purgeAllWorkspaceDataFromFirestore } from '../services/firestoreSync';
import { metaApiClient } from '../services/metaWhatsAppApi';
import {
  MetaConfig,
  Contact,
  Conversation,
  WhatsAppMessage,
  WhatsAppTemplate,
  Campaign,
  AutomationWorkflow,
  AIAgentConfig,
  TeamMember,
  MediaAsset,
  ClickToWhatsAppLead,
  AudienceSegment,
  FlowItem,
  FormItem,
  WebhookLog,
  UserAccount,
  SystemVersion
} from '../types';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_META_CONFIG,
  INITIAL_TEAM_MEMBERS,
  INITIAL_CONTACTS,
  INITIAL_SEGMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES_CONV_1,
  INITIAL_TEMPLATES,
  INITIAL_CAMPAIGNS,
  INITIAL_AUTOMATIONS,
  INITIAL_AI_AGENT,
  INITIAL_MEDIA,
  INITIAL_CTWA_LEADS,
  INITIAL_FLOWS,
  INITIAL_FORMS,
  INITIAL_WEBHOOK_LOGS
} from '../data/initialData';

interface AppContextType {
  currentUser: UserAccount | null;
  allUsers: UserAccount[];
  impersonatingFromMaster: boolean;
  systemVersion: SystemVersion;
  isAuthenticated: boolean;
  isMasterLoggedIn: boolean;
  masterPasswordModalOpen: boolean;
  setMasterPasswordModalOpen: (open: boolean) => void;
  verifyMasterPanelPassword: (enteredPass: string) => boolean;
  isMasterPanelUnlocked: boolean;
  login: (mobile: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: { mobile: string; email: string; password?: string; city: string; businessName?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  publishSystemUpdate: (releaseNotes: string, globalNotice?: string) => Promise<void>;
  viewUserWorkspace: (user: UserAccount) => void;
  returnToMaster: () => void;

  metaConfig: MetaConfig;
  companyProfile: typeof INITIAL_COMPANY_PROFILE;
  contacts: Contact[];
  segments: AudienceSegment[];
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  messages: WhatsAppMessage[];
  templates: WhatsAppTemplate[];
  campaigns: Campaign[];
  automations: AutomationWorkflow[];
  aiAgentConfig: AIAgentConfig;
  teamMembers: TeamMember[];
  mediaAssets: MediaAsset[];
  ctwaLeads: ClickToWhatsAppLead[];
  flows: FlowItem[];
  forms: FormItem[];
  webhookLogs: WebhookLog[];
  isRealTimeSynced: boolean;
  isLoading: boolean;

  // Actions
  updateMetaConfig: (updates: Partial<MetaConfig>) => Promise<void>;
  updateCompanyProfile: (profile: typeof INITIAL_COMPANY_PROFILE) => Promise<void>;
  sendMessage: (text: string, mediaPayload?: { type: any; url: string; fileName?: string; caption?: string }) => Promise<void>;
  simulateIncomingCustomerMessage: (customText?: string) => Promise<void>;
  simulateCoexistenceAppEcho: (customText?: string) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'lastConversationAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  createTemplate: (template: Omit<WhatsAppTemplate, 'id' | 'updatedAt'>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  refreshTemplatesFromMeta: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'readCount' | 'failedCount' | 'repliedCount'>) => Promise<void>;
  addAutomation: (workflow: Omit<AutomationWorkflow, 'id' | 'runsCount'>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  toggleAutomation: (id: string) => Promise<void>;
  updateAIAgentConfig: (updates: Partial<AIAgentConfig>) => Promise<void>;
  assignConversationAgent: (conversationId: string, agentId: string, agentName: string) => Promise<void>;
  addInternalNote: (conversationId: string, noteText: string) => Promise<void>;
  triggerHumanHandover: (conversationId: string) => Promise<void>;
  triggerTestWebhook: (eventType: string) => Promise<void>;
  clearDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master user default
  const DEFAULT_MASTER: UserAccount = {
    id: 'master_9974428034',
    mobile: '9974428034',
    email: 'master@laxtoneceramic.com',
    password: '77777777',
    city: 'Morbi',
    role: 'master',
    status: 'approved',
    tenantId: 'master',
    businessName: 'Master Admin Control Hub',
    createdAt: '2026-09-28T00:00:00.000Z',
    approvedAt: '2026-09-28T00:00:00.000Z'
  };

  const DEFAULT_VERSION: SystemVersion = {
    sequence: 1001,
    versionCode: 'ver - 1001',
    releaseNotes: 'Multi-Tenant Architecture, Master Admin Control & Approval System',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Master Admin'
  };

  // Auth & Master states (persisted in localStorage for convenience)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('lx_logged_in_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [allUsers, setAllUsers] = useState<UserAccount[]>([DEFAULT_MASTER]);
  const [impersonatingFromMaster, setImpersonatingFromMaster] = useState(false);
  const [systemVersion, setSystemVersion] = useState<SystemVersion>(DEFAULT_VERSION);
  const [masterPasswordModalOpen, setMasterPasswordModalOpen] = useState(false);
  const [isMasterPanelUnlocked, setIsMasterPanelUnlocked] = useState(false);

  const [metaConfig, setMetaConfig] = useState<MetaConfig>(INITIAL_META_CONFIG);
  const [companyProfile, setCompanyProfile] = useState(INITIAL_COMPANY_PROFILE);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [segments, setSegments] = useState<AudienceSegment[]>(INITIAL_SEGMENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<WhatsAppMessage[]>(INITIAL_MESSAGES_CONV_1);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(INITIAL_TEMPLATES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [automations, setAutomations] = useState<AutomationWorkflow[]>(INITIAL_AUTOMATIONS);
  const [aiAgentConfig, setAIAgentConfig] = useState<AIAgentConfig>(INITIAL_AI_AGENT);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [ctwaLeads, setCtwaLeads] = useState<ClickToWhatsAppLead[]>(INITIAL_CTWA_LEADS);
  const [flows, setFlows] = useState<FlowItem[]>(INITIAL_FLOWS);
  const [forms, setForms] = useState<FormItem[]>(INITIAL_FORMS);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(INITIAL_WEBHOOK_LOGS);
  const [isRealTimeSynced, setIsRealTimeSynced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and attach Firestore real-time listeners
  useEffect(() => {
    let unsubscribers: (() => void)[] = [];

    const initialize = async () => {
      try {
        await seedInitialFirestoreData();

        // 1. Meta Config Listener
        const unsubMeta = onSnapshot(doc(db, COLLECTIONS.META_CONFIG, 'current'), (docSnap) => {
          if (docSnap.exists()) {
            setMetaConfig(docSnap.data() as MetaConfig);
          }
        }, (err) => console.log('MetaConfig snap notice:', err.message));
        unsubscribers.push(unsubMeta);

        // 2. Company Profile Listener
        const unsubProfile = onSnapshot(doc(db, COLLECTIONS.COMPANY_PROFILE, 'laxtone'), (docSnap) => {
          if (docSnap.exists()) {
            setCompanyProfile(docSnap.data() as typeof INITIAL_COMPANY_PROFILE);
          }
        }, (err) => console.log('Profile snap notice:', err.message));
        unsubscribers.push(unsubProfile);

        // 3. Contacts Listener
        const unsubContacts = onSnapshot(collection(db, COLLECTIONS.CONTACTS), (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Contact));
          setContacts(list);
        }, (err) => console.log('Contacts snap notice:', err.message));
        unsubscribers.push(unsubContacts);

        // 4. Conversations Listener
        const unsubConv = onSnapshot(collection(db, COLLECTIONS.CONVERSATIONS), (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Conversation));
          setConversations(list);
        }, (err) => console.log('Conversations snap notice:', err.message));
        unsubscribers.push(unsubConv);

        // 5. Messages Listener
        const unsubMsgs = onSnapshot(collection(db, COLLECTIONS.MESSAGES), (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as WhatsAppMessage));
          list.sort((a, b) => a.id.localeCompare(b.id));
          setMessages(list);
        }, (err) => console.log('Messages snap notice:', err.message));
        unsubscribers.push(unsubMsgs);

        // 6. Templates Listener
        const unsubTmpl = onSnapshot(collection(db, COLLECTIONS.TEMPLATES), (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as WhatsAppTemplate));
          setTemplates(list);
        }, (err) => console.log('Templates snap notice:', err.message));
        unsubscribers.push(unsubTmpl);

        // 7. Campaigns Listener
        const unsubCmp = onSnapshot(collection(db, COLLECTIONS.CAMPAIGNS), (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
          setCampaigns(list);
        }, (err) => console.log('Campaigns snap notice:', err.message));
        unsubscribers.push(unsubCmp);

        // 8. Automations Listener
        const unsubAuto = onSnapshot(collection(db, COLLECTIONS.AUTOMATIONS), (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AutomationWorkflow));
          setAutomations(list);
        }, (err) => console.log('Automations snap notice:', err.message));
        unsubscribers.push(unsubAuto);

        // 9. AI Agent Listener
        const unsubAi = onSnapshot(doc(db, COLLECTIONS.AI_AGENT, 'config'), (docSnap) => {
          if (docSnap.exists()) {
            setAIAgentConfig(docSnap.data() as AIAgentConfig);
          }
        }, (err) => console.log('AI agent snap notice:', err.message));
        unsubscribers.push(unsubAi);

        // 10. Webhooks Listener
        const unsubWh = onSnapshot(collection(db, COLLECTIONS.WEBHOOKS), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as WebhookLog));
            setWebhookLogs(list);
          }
        }, (err) => console.log('Webhook snap notice:', err.message));
        unsubscribers.push(unsubWh);

        // 11. Users Listener (Multi-Tenant & Approvals)
        const unsubUsers = onSnapshot(collection(db, COLLECTIONS.USERS), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserAccount));
            // Always ensure master account is present
            if (!list.some(u => u.mobile === '9974428034')) {
              list.unshift(DEFAULT_MASTER);
            }
            setAllUsers(list);

            // Update current user if status updated (e.g. approved by master)
            setCurrentUser(prev => {
              if (!prev) return null;
              const matching = list.find(u => u.id === prev.id || u.mobile === prev.mobile);
              if (matching) {
                localStorage.setItem('lx_logged_in_user', JSON.stringify(matching));
                return matching;
              }
              return prev;
            });
          }
        }, (err) => console.log('Users snap notice:', err.message));
        unsubscribers.push(unsubUsers);

        // 12. Global System Version Listener
        const unsubVersion = onSnapshot(doc(db, COLLECTIONS.SYSTEM_VERSION, 'version'), (docSnap) => {
          if (docSnap.exists()) {
            setSystemVersion(docSnap.data() as SystemVersion);
          }
        }, (err) => console.log('Version snap notice:', err.message));
        unsubscribers.push(unsubVersion);

        setIsRealTimeSynced(true);
      } catch (e) {
        console.warn('Using local reactive state with Firestore fallback:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Authentication Actions
  const login = async (mobile: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const cleanedMobile = mobile.trim();
    // Check if master credentials
    if (cleanedMobile === '9974428034' && password === '77777777') {
      const masterUser: UserAccount = {
        id: 'master_9974428034',
        mobile: '9974428034',
        email: 'master@laxtoneceramic.com',
        city: 'Morbi',
        role: 'master',
        status: 'approved',
        tenantId: 'master',
        businessName: 'Master Admin Control Hub',
        createdAt: '2026-09-28T00:00:00.000Z',
        approvedAt: '2026-09-28T00:00:00.000Z'
      };
      setCurrentUser(masterUser);
      localStorage.setItem('lx_logged_in_user', JSON.stringify(masterUser));
      return { success: true, message: 'Master Admin logged in successfully!' };
    }

    // Check registered users
    const foundUser = allUsers.find(u => u.mobile.replace(/\D/g, '') === cleanedMobile.replace(/\D/g, ''));
    if (!foundUser) {
      return { success: false, message: 'Mobile number not registered. Please register / signup first.' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    // Check approval status
    if (foundUser.status === 'pending') {
      return {
        success: false,
        message: 'Aapka account abhi Master Admin approval ke liye PENDING hai. Master Admin ke approve karte hi aapka panel login ho jayega.'
      };
    }

    if (foundUser.status === 'rejected' || foundUser.status === 'blocked') {
      return {
        success: false,
        message: 'Aapka account activate nahi hai. Kripya Master Admin se contact karein.'
      };
    }

    // Logged in as approved tenant user
    setCurrentUser(foundUser);
    localStorage.setItem('lx_logged_in_user', JSON.stringify(foundUser));

    // Initialize fresh personalized panel config for approved tenant
    setCompanyProfile({
      companyName: foundUser.businessName || `${foundUser.city} Tiles & Ceramic`,
      brandTagline: `Official WhatsApp Hub - ${foundUser.city}`,
      industry: 'Tiles & Ceramic Business',
      website: '',
      email: foundUser.email,
      phone: foundUser.mobile,
      address: `${foundUser.city}, India`,
      gstin: '',
      description: `WhatsApp Business Platform node configured for ${foundUser.businessName || foundUser.mobile}.`,
      productCategories: [
        'Vitrified Floor Tiles',
        'Wall Highlighter Tiles',
        'Architectural Slabs'
      ]
    });

    setMetaConfig({
      appId: '',
      wabaId: '',
      phoneNumberId: '',
      displayPhoneNumber: foundUser.mobile.startsWith('+') ? foundUser.mobile : `+91 ${foundUser.mobile}`,
      businessName: foundUser.businessName || `${foundUser.city} Ceramic`,
      qualityRating: 'UNKNOWN',
      messagingLimit: 'TIER_NOT_CONNECTED',
      status: 'DISCONNECTED',
      coexistenceEnabled: false,
      coexistenceStatus: 'DISCONNECTED',
      webhookStatus: 'PENDING_SETUP',
      tokenStatus: 'INVALID',
      lastSyncTime: 'Fresh Personal Workspace Ready for Meta Connection',
      isDemoMode: false
    });

    return { success: true, message: 'Login successful! Opening your fresh workspace...' };
  };

  const signup = async (userData: {
    mobile: string;
    email: string;
    password?: string;
    city: string;
    businessName?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanedMobile = userData.mobile.trim();
    if (!cleanedMobile) {
      return { success: false, message: 'Mobile number is required.' };
    }

    const exists = allUsers.some(u => u.mobile.replace(/\D/g, '') === cleanedMobile.replace(/\D/g, ''));
    if (exists) {
      return { success: false, message: 'This mobile number is already registered. Please login.' };
    }

    const newUserId = `user_${Date.now()}`;
    const newTenantId = `tenant_${cleanedMobile.slice(-4)}_${Date.now().toString().slice(-4)}`;

    const newUser: UserAccount = {
      id: newUserId,
      mobile: cleanedMobile,
      email: userData.email.trim(),
      password: userData.password || '123456',
      city: userData.city.trim(),
      businessName: userData.businessName?.trim() || 'Fresh WhatsApp Workspace',
      role: 'user',
      status: 'pending', // Requires master approval!
      tenantId: newTenantId,
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [newUser, ...prev]);

    try {
      await setDoc(doc(db, COLLECTIONS.USERS, newUserId), newUser);
    } catch (e) {
      console.warn('Saved user locally, syncing to Firestore:', e);
    }

    return {
      success: true,
      message: 'Signup successful! Aapki request Master Admin ke paas approval ke liye bhej di gayi hai. Master Admin dwara approve hote hi aap login kar payenge.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsMasterPanelUnlocked(false);
    setImpersonatingFromMaster(false);
    localStorage.removeItem('lx_logged_in_user');
  };

  // MASTER ADMIN: Directly view and inspect any approved user's panel/workspace
  const viewUserWorkspace = (targetUser: UserAccount) => {
    setImpersonatingFromMaster(true);
    setCurrentUser(targetUser);

    // Load target user's company profile & panel settings
    setCompanyProfile({
      companyName: targetUser.businessName || `${targetUser.city} Ceramic`,
      brandTagline: `Official WhatsApp Node - ${targetUser.city}`,
      industry: 'Tiles & Ceramic Business',
      website: '',
      email: targetUser.email,
      phone: targetUser.mobile,
      address: `${targetUser.city}, India`,
      gstin: '',
      description: `WhatsApp Business Platform node for ${targetUser.businessName || targetUser.mobile}.`,
      productCategories: [
        'Vitrified Floor Tiles',
        'Wall Highlighter Tiles',
        'Architectural Slabs'
      ]
    });

    setMetaConfig({
      appId: '',
      wabaId: '',
      phoneNumberId: '',
      displayPhoneNumber: targetUser.mobile.startsWith('+') ? targetUser.mobile : `+91 ${targetUser.mobile}`,
      businessName: targetUser.businessName || `${targetUser.city} Ceramic`,
      qualityRating: 'UNKNOWN',
      messagingLimit: 'TIER_NOT_CONNECTED',
      status: 'DISCONNECTED',
      coexistenceEnabled: false,
      coexistenceStatus: 'DISCONNECTED',
      webhookStatus: 'PENDING_SETUP',
      tokenStatus: 'INVALID',
      lastSyncTime: `Inspecting ${targetUser.businessName} Panel as Master`,
      isDemoMode: false
    });
  };

  // Return back to Master Super Admin Panel
  const returnToMaster = () => {
    setImpersonatingFromMaster(false);
    setCurrentUser(DEFAULT_MASTER);
    setIsMasterPanelUnlocked(true);
    localStorage.setItem('lx_logged_in_user', JSON.stringify(DEFAULT_MASTER));
  };

  const approveUser = async (userId: string) => {
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'approved' as const,
          approvedAt: new Date().toISOString()
        };
      }
      return u;
    });

    setAllUsers(updatedUsers);

    try {
      await setDoc(doc(db, COLLECTIONS.USERS, userId), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Approved user locally:', e);
    }
  };

  const rejectUser = async (userId: string) => {
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'rejected' as const };
      }
      return u;
    });
    setAllUsers(updatedUsers);

    try {
      await setDoc(doc(db, COLLECTIONS.USERS, userId), { status: 'rejected' }, { merge: true });
    } catch (e) {
      console.warn('Rejected user locally:', e);
    }
  };

  const verifyMasterPanelPassword = (enteredPass: string): boolean => {
    if (enteredPass === '123456789') {
      setIsMasterPanelUnlocked(true);
      return true;
    }
    return false;
  };

  const publishSystemUpdate = async (releaseNotes: string, notice?: string) => {
    const nextSeq = (systemVersion.sequence || 1000) + 1;
    const newVersionCode = `ver - ${nextSeq}`;

    const newVersion: SystemVersion = {
      sequence: nextSeq,
      versionCode: newVersionCode,
      releaseNotes,
      globalNotice: notice,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.businessName || 'Master Admin'
    };

    setSystemVersion(newVersion);

    try {
      await setDoc(doc(db, COLLECTIONS.SYSTEM_VERSION, 'version'), newVersion, { merge: true });
    } catch (e) {
      console.warn('Saved system version locally:', e);
    }
  };

  const updateMetaConfig = async (updates: Partial<MetaConfig>) => {
    const updated = { ...metaConfig, ...updates, lastSyncTime: 'Just now (Updated)' };
    setMetaConfig(updated);
    try {
      await setDoc(doc(db, COLLECTIONS.META_CONFIG, 'current'), updated, { merge: true });
    } catch (err) {
      console.warn('Error saving meta_config to Firestore, local state preserved:', err);
    }
  };

  const updateCompanyProfile = async (profile: typeof INITIAL_COMPANY_PROFILE) => {
    setCompanyProfile(profile);
    try {
      await setDoc(doc(db, COLLECTIONS.COMPANY_PROFILE, 'laxtone'), profile);
    } catch {
      // Fallback
    }
  };

  const sendMessage = async (
    text: string,
    mediaPayload?: { type: any; url: string; fileName?: string; caption?: string }
  ) => {
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if (!currentConv) return;

    const newMsgId = `msg-${Date.now()}`;
    const newMsg: WhatsAppMessage = {
      id: newMsgId,
      conversationId: activeConversationId,
      sender: 'business',
      senderName: 'Laxtone Sales (Panel)',
      type: mediaPayload ? mediaPayload.type : 'text',
      text: text || undefined,
      mediaUrl: mediaPayload?.url,
      mediaFileName: mediaPayload?.fileName,
      mediaCaption: mediaPayload?.caption,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Optimistically update
    setMessages(prev => [...prev, newMsg]);

    // Send through Meta API client
    const apiRes = await metaApiClient.sendMessage(
      metaConfig.phoneNumberId,
      currentConv.contactPhone,
      {
        type: mediaPayload ? mediaPayload.type : 'text',
        text: text,
        mediaUrl: mediaPayload?.url,
        mediaCaption: mediaPayload?.caption
      }
    );

    if (apiRes.success) {
      newMsg.status = 'delivered';
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, status: 'read' } : m));
      }, 2500);
    }

    // Persist in Firestore
    try {
      await setDoc(doc(db, COLLECTIONS.MESSAGES, newMsgId), newMsg);
      await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, activeConversationId), {
        lastMessage: text || (mediaPayload ? `Sent ${mediaPayload.fileName || mediaPayload.type}` : 'Media'),
        lastMessageType: newMsg.type,
        lastMessageTimestamp: newMsg.timestamp
      });
    } catch {
      // Fallback local update
      setConversations(prev => prev.map(c =>
        c.id === activeConversationId
          ? { ...c, lastMessage: text || 'Media attachment', lastMessageTimestamp: newMsg.timestamp }
          : c
      ));
    }

    // Check if AI reply is enabled and no human handover is active
    if (currentConv.aiAssisted && !currentConv.aiHandover && aiAgentConfig.enabled) {
      setTimeout(async () => {
        // AI simulated response based on tiles knowledge
        let aiReplyText = 'Thank you for your inquiry! Our Morbi manufacturing line produces standard 600x1200mm carving and 800x1600mm vitrified slabs packed in palletized wooden crates (FOB Mundra Port compliant).';
        if (text.toLowerCase().includes('price') || text.toLowerCase().includes('discount') || text.toLowerCase().includes('rate')) {
          aiReplyText = 'For ex-factory Morbi wholesale slab pricing, please provide your GST number and required box quantity. Connecting you with our Domestic Distribution Head Amit Shah.';
          await triggerHumanHandover(activeConversationId);
        }

        const aiMsgId = `msg-ai-${Date.now()}`;
        const aiMsg: WhatsAppMessage = {
          id: aiMsgId,
          conversationId: activeConversationId,
          sender: 'bot',
          senderName: aiAgentConfig.aiName,
          type: 'text',
          text: aiReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };

        setMessages(prev => [...prev, aiMsg]);
        try {
          await setDoc(doc(db, COLLECTIONS.MESSAGES, aiMsgId), aiMsg);
        } catch { }
      }, 1500);
    }
  };

  const simulateIncomingCustomerMessage = async (customText?: string) => {
    const text = customText || 'Hi, please confirm availability of 200 boxes of Royal Gold High Gloss 600x1200mm tiles.';
    const incomingId = `msg-inc-${Date.now()}`;
    const incomingMsg: WhatsAppMessage = {
      id: incomingId,
      conversationId: activeConversationId,
      sender: 'user',
      senderName: conversations.find(c => c.id === activeConversationId)?.contactName || 'Customer',
      type: 'text',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    setMessages(prev => [...prev, incomingMsg]);
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, lastMessage: text, lastMessageTimestamp: incomingMsg.timestamp, unreadCount: c.unreadCount + 1 }
        : c
    ));

    try {
      await setDoc(doc(db, COLLECTIONS.MESSAGES, incomingId), incomingMsg);
      await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, activeConversationId), {
        lastMessage: text,
        lastMessageTimestamp: incomingMsg.timestamp
      });

      // Add to webhook logs
      const whId = `wh-${Date.now()}`;
      const log: WebhookLog = {
        id: whId,
        event: 'messages.incoming',
        status: 'SUCCESS',
        statusCode: 200,
        payload: JSON.stringify({
          from: conversations.find(c => c.id === activeConversationId)?.contactPhone,
          message: text,
          timestamp: new Date().toISOString()
        }),
        timestamp: new Date().toLocaleString()
      };
      await setDoc(doc(db, COLLECTIONS.WEBHOOKS, whId), log);
    } catch { }
  };

  const simulateCoexistenceAppEcho = async (customText?: string) => {
    const text = customText || 'Sent from WhatsApp Business App on Mobile: "Dispatched sample tile carton #LX-99 via DTDC Courier."';
    const echoId = `msg-echo-${Date.now()}`;
    const echoMsg: WhatsAppMessage = {
      id: echoId,
      conversationId: activeConversationId,
      sender: 'business',
      senderName: 'WhatsApp Business App (Coexistence Sync)',
      type: 'text',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      isEchoFromApp: true
    };

    setMessages(prev => [...prev, echoMsg]);
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, lastMessage: text, lastMessageTimestamp: echoMsg.timestamp }
        : c
    ));

    try {
      await setDoc(doc(db, COLLECTIONS.MESSAGES, echoId), echoMsg);
    } catch { }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'lastConversationAt'>) => {
    const newId = `c-${Date.now()}`;
    const newContact: Contact = {
      ...contactData,
      id: newId,
      createdAt: new Date().toISOString(),
      lastConversationAt: 'Just now'
    };

    setContacts(prev => [newContact, ...prev]);
    try {
      await setDoc(doc(db, COLLECTIONS.CONTACTS, newId), newContact);
    } catch { }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    try {
      await updateDoc(doc(db, COLLECTIONS.CONTACTS, id), updates);
    } catch { }
  };

  const deleteContact = async (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, COLLECTIONS.CONTACTS, id));
    } catch { }
  };

  const createTemplate = async (templateData: Omit<WhatsAppTemplate, 'id' | 'updatedAt'>) => {
    const newId = `tmpl-${Date.now()}`;
    const newTemplate: WhatsAppTemplate = {
      ...templateData,
      id: newId,
      metaTemplateId: `meta_${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    setTemplates(prev => [newTemplate, ...prev]);
    try {
      await setDoc(doc(db, COLLECTIONS.TEMPLATES, newId), newTemplate);
    } catch { }
  };

  const deleteTemplate = async (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    try {
      await deleteDoc(doc(db, COLLECTIONS.TEMPLATES, id));
    } catch { }
  };

  const refreshTemplatesFromMeta = async () => {
    // Sync simulated approvals from Meta
    setTemplates(prev => prev.map(t => t.status === 'PENDING' ? { ...t, status: 'APPROVED' } : t));
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'readCount' | 'failedCount' | 'repliedCount'>) => {
    const newId = `cmp-${Date.now()}`;
    const newCampaign: Campaign = {
      ...campaignData,
      id: newId,
      sentCount: campaignData.totalRecipients,
      deliveredCount: Math.round(campaignData.totalRecipients * 0.96),
      readCount: Math.round(campaignData.totalRecipients * 0.78),
      failedCount: Math.round(campaignData.totalRecipients * 0.04),
      repliedCount: Math.round(campaignData.totalRecipients * 0.22),
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    try {
      await setDoc(doc(db, COLLECTIONS.CAMPAIGNS, newId), newCampaign);
    } catch { }
  };

  const addAutomation = async (workflow: Omit<AutomationWorkflow, 'id' | 'runsCount'>) => {
    const newId = `auto_${Date.now()}`;
    const newWorkflow: AutomationWorkflow = {
      ...workflow,
      id: newId,
      runsCount: 0
    };
    setAutomations(prev => [newWorkflow, ...prev]);
    try {
      await setDoc(doc(db, COLLECTIONS.AUTOMATIONS, newId), newWorkflow);
    } catch { }
  };

  const deleteAutomation = async (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    try {
      await deleteDoc(doc(db, COLLECTIONS.AUTOMATIONS, id));
    } catch { }
  };

  const toggleAutomation = async (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    const target = automations.find(a => a.id === id);
    if (target) {
      try {
        await updateDoc(doc(db, COLLECTIONS.AUTOMATIONS, id), { enabled: !target.enabled });
      } catch { }
    }
  };

  const updateAIAgentConfig = async (updates: Partial<AIAgentConfig>) => {
    const updated = { ...aiAgentConfig, ...updates };
    setAIAgentConfig(updated);
    try {
      await setDoc(doc(db, COLLECTIONS.AI_AGENT, 'config'), updated);
    } catch { }
  };

  const assignConversationAgent = async (conversationId: string, agentId: string, agentName: string) => {
    setConversations(prev => prev.map(c =>
      c.id === conversationId ? { ...c, assignedAgentId: agentId, assignedAgentName: agentName } : c
    ));
    try {
      await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
        assignedAgentId: agentId,
        assignedAgentName: agentName
      });
    } catch { }
  };

  const addInternalNote = async (conversationId: string, noteText: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Rajesh Patel (Owner)',
      text: noteText,
      createdAt: new Date().toLocaleString()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return { ...c, notes: [...(c.notes || []), newNote] };
      }
      return c;
    }));

    try {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
          notes: [...(conv.notes || []), newNote]
        });
      }
    } catch { }
  };

  const triggerHumanHandover = async (conversationId: string) => {
    setConversations(prev => prev.map(c =>
      c.id === conversationId ? { ...c, aiHandover: true, assignedAgentName: 'Amit Shah (Manager)' } : c
    ));
    try {
      await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
        aiHandover: true,
        assignedAgentName: 'Amit Shah (Manager)'
      });
    } catch { }
  };

  const triggerTestWebhook = async (eventType: string) => {
    const whId = `wh-${Date.now()}`;
    const log: WebhookLog = {
      id: whId,
      event: eventType,
      status: 'SUCCESS',
      statusCode: 200,
      payload: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
          id: metaConfig.wabaId,
          time: Math.floor(Date.now() / 1000),
          event_type: eventType,
          verified: true
        }]
      }, null, 2),
      timestamp: new Date().toLocaleString()
    };

    setWebhookLogs(prev => [log, ...prev]);
    try {
      await setDoc(doc(db, COLLECTIONS.WEBHOOKS, whId), log);
    } catch { }
  };

  const clearDemoData = async () => {
    // 1. Reset all local states to 100% clean, blank workspace
    setContacts([]);
    setSegments([]);
    setConversations([]);
    setMessages([]);
    setActiveConversationId('');
    setCampaigns([]);
    setCtwaLeads([]);
    setWebhookLogs([]);
    setMediaAssets([]);
    setFlows([]);
    setForms([]);
    setAutomations([]);

    // 2. Wipe all remote Firestore documents in data collections
    await purgeAllWorkspaceDataFromFirestore();

    // 3. Switch off demo mode & set clean disconnected status
    await updateMetaConfig({
      isDemoMode: false,
      status: 'DISCONNECTED',
      qualityRating: 'UNKNOWN',
      messagingLimit: 'TIER_NOT_CONNECTED',
      coexistenceStatus: 'NOT_CONNECTED',
      webhookStatus: 'PENDING_SETUP',
      tokenStatus: 'INVALID',
      lastSyncTime: 'Clean Live Workspace Activated (Awaiting Official Setup)'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        impersonatingFromMaster,
        systemVersion,
        isAuthenticated: Boolean(currentUser),
        isMasterLoggedIn: currentUser?.role === 'master',
        masterPasswordModalOpen,
        setMasterPasswordModalOpen,
        verifyMasterPanelPassword,
        isMasterPanelUnlocked,
        login,
        signup,
        logout,
        approveUser,
        rejectUser,
        publishSystemUpdate,
        viewUserWorkspace,
        returnToMaster,

        metaConfig,
        companyProfile,
        contacts,
        segments,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        templates,
        campaigns,
        automations,
        aiAgentConfig,
        teamMembers,
        mediaAssets,
        ctwaLeads,
        flows,
        forms,
        webhookLogs,
        isRealTimeSynced,
        isLoading,
        updateMetaConfig,
        updateCompanyProfile,
        sendMessage,
        simulateIncomingCustomerMessage,
        simulateCoexistenceAppEcho,
        addContact,
        updateContact,
        deleteContact,
        createTemplate,
        deleteTemplate,
        refreshTemplatesFromMeta,
        createCampaign,
        addAutomation,
        deleteAutomation,
        toggleAutomation,
        updateAIAgentConfig,
        assignConversationAgent,
        addInternalNote,
        triggerHumanHandover,
        triggerTestWebhook,
        clearDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
