import {
  collection,
  doc,
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

// Check and seed initial data if Firestore is empty
export async function seedInitialFirestoreData() {
  try {
    const metaDocRef = doc(db, COLLECTIONS.META_CONFIG, 'current');
    const contactsSnap = await getDocs(collection(db, COLLECTIONS.CONTACTS));

    if (contactsSnap.empty) {
      console.log('🌱 Seeding initial Laxtone Ceramic data into Firestore for real-time sync...');

      // Seed meta config
      await setDoc(metaDocRef, INITIAL_META_CONFIG);

      // Seed company profile
      await setDoc(doc(db, COLLECTIONS.COMPANY_PROFILE, 'laxtone'), INITIAL_COMPANY_PROFILE);

      // Seed contacts
      for (const contact of INITIAL_CONTACTS) {
        await setDoc(doc(db, COLLECTIONS.CONTACTS, contact.id), contact);
      }

      // Seed segments
      for (const seg of INITIAL_SEGMENTS) {
        await setDoc(doc(db, COLLECTIONS.SEGMENTS, seg.id), seg);
      }

      // Seed conversations
      for (const conv of INITIAL_CONVERSATIONS) {
        await setDoc(doc(db, COLLECTIONS.CONVERSATIONS, conv.id), conv);
      }

      // Seed messages
      for (const msg of INITIAL_MESSAGES_CONV_1) {
        await setDoc(doc(db, COLLECTIONS.MESSAGES, msg.id), msg);
      }

      // Seed templates
      for (const tmpl of INITIAL_TEMPLATES) {
        await setDoc(doc(db, COLLECTIONS.TEMPLATES, tmpl.id), tmpl);
      }

      // Seed campaigns
      for (const cmp of INITIAL_CAMPAIGNS) {
        await setDoc(doc(db, COLLECTIONS.CAMPAIGNS, cmp.id), cmp);
      }

      // Seed automations
      for (const auto of INITIAL_AUTOMATIONS) {
        await setDoc(doc(db, COLLECTIONS.AUTOMATIONS, auto.id), auto);
      }

      // Seed AI agent
      await setDoc(doc(db, COLLECTIONS.AI_AGENT, 'config'), INITIAL_AI_AGENT);

      // Seed team members
      for (const member of INITIAL_TEAM_MEMBERS) {
        await setDoc(doc(db, COLLECTIONS.TEAM, member.id), member);
      }

      // Seed media
      for (const med of INITIAL_MEDIA) {
        await setDoc(doc(db, COLLECTIONS.MEDIA, med.id), med);
      }

      // Seed CTWA leads
      for (const lead of INITIAL_CTWA_LEADS) {
        await setDoc(doc(db, COLLECTIONS.CTWA_LEADS, lead.id), lead);
      }

      // Seed flows
      for (const fl of INITIAL_FLOWS) {
        await setDoc(doc(db, COLLECTIONS.FLOWS, fl.id), fl);
      }

      // Seed forms
      for (const fm of INITIAL_FORMS) {
        await setDoc(doc(db, COLLECTIONS.FORMS, fm.id), fm);
      }

      // Seed webhooks
      for (const wh of INITIAL_WEBHOOK_LOGS) {
        await setDoc(doc(db, COLLECTIONS.WEBHOOKS, wh.id), wh);
      }

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
        releaseNotes: 'Multi-Tenant Architecture, Master Admin Panel & Approval System Online',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Master Admin'
      });

      console.log('✅ Initial seed completed successfully.');
    }
  } catch (error) {
    console.error('Error during Firestore seeding:', error);
  }
}
