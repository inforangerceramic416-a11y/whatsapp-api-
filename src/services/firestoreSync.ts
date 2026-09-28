import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  WebhookLog
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

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  SYSTEM_VERSION: 'system_settings',
  META_CONFIG: 'meta_config',
  COMPANY_PROFILE: 'company_profile',
  CONTACTS: 'contacts',
  SEGMENTS: 'segments',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  TEMPLATES: 'templates',
  CAMPAIGNS: 'campaigns',
  AUTOMATIONS: 'automations',
  AI_AGENT: 'ai_agent',
  TEAM: 'team',
  MEDIA: 'media',
  CTWA_LEADS: 'ctwa_leads',
  FLOWS: 'flows',
  FORMS: 'forms',
  WEBHOOKS: 'webhook_logs'
};

// Collections to be wiped completely for clean blank production workspace
const WIPABLE_COLLECTIONS = [
  COLLECTIONS.CONTACTS,
  COLLECTIONS.CONVERSATIONS,
  COLLECTIONS.MESSAGES,
  COLLECTIONS.CAMPAIGNS,
  COLLECTIONS.SEGMENTS,
  COLLECTIONS.CTWA_LEADS,
  COLLECTIONS.WEBHOOKS,
  COLLECTIONS.MEDIA,
  COLLECTIONS.FLOWS,
  COLLECTIONS.FORMS,
  COLLECTIONS.AUTOMATIONS,
  COLLECTIONS.TEMPLATES
];

// Completely flush and purge all demo/temporary data from Firestore
export async function purgeAllWorkspaceDataFromFirestore() {
  console.log('🧹 Purging all demo entries, chats, contacts and campaigns from Firestore...');
  try {
    for (const colName of WIPABLE_COLLECTIONS) {
      const snap = await getDocs(collection(db, colName));
      const deletePromises = snap.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    }

    // Reset meta config to clean disconnected state
    await setDoc(doc(db, COLLECTIONS.META_CONFIG, 'current'), INITIAL_META_CONFIG, { merge: true });
    console.log('✨ All collections successfully wiped. Workspace is now 100% clean and blank.');
  } catch (error) {
    console.error('Error while purging workspace collections from Firestore:', error);
  }
}

// Check and seed initial data if Firestore is empty (Only Core Master & System Config, NO DEMO CHATS/CONTACTS)
export async function seedInitialFirestoreData() {
  try {
    const metaDocRef = doc(db, COLLECTIONS.META_CONFIG, 'current');
    const metaSnap = await getDoc(metaDocRef);

    if (!metaSnap.exists()) {
      console.log('🌱 Initializing clean production config for Laxtone Ceramic in Firestore...');

      // Seed clean meta config
      await setDoc(metaDocRef, INITIAL_META_CONFIG);

      // Seed company profile
      await setDoc(doc(db, COLLECTIONS.COMPANY_PROFILE, 'laxtone'), INITIAL_COMPANY_PROFILE);

      // Seed AI agent config
      await setDoc(doc(db, COLLECTIONS.AI_AGENT, 'config'), INITIAL_AI_AGENT);

      // Seed Master Account
      await setDoc(doc(db, COLLECTIONS.USERS, 'master_9974428034'), {
        id: 'master_9974428034',
        mobile: '9974428034',
        email: 'master@laxtoneceramic.com',
        password: '77777777',
        city: 'Morbi',
        role: 'master',
        status: 'approved',
        tenantId: 'master',
        businessName: 'Master Admin Control Hub',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString()
      });

      // Seed Initial System Version
      await setDoc(doc(db, COLLECTIONS.SYSTEM_VERSION, 'version'), {
        sequence: 1001,
        versionCode: 'ver - 1001',
        releaseNotes: 'Clean Multi-Tenant Architecture & Master Admin Panel Online',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Master Admin'
      });

      console.log('✅ Clean initial setup completed (Zero demo entries).');
    }
  } catch (error) {
    console.error('Notice during Firestore initialization:', error);
  }
}
