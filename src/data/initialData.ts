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

export const INITIAL_COMPANY_PROFILE = {
  companyName: 'LAXTONE CERAMIC',
  brandTagline: 'Excellence in Decorative & Architectural Tiles',
  industry: 'Decorative Tiles Manufacturing',
  website: 'www.laxtoneceramic.com',
  email: 'info.rangerceramic416@gmail.com',
  phone: '9099268044',
  address: '8-A National Highway, Morbi, Gujarat 363642, India',
  gstin: '24AAACL7812M1Z0',
  description: 'Leading manufacturer and global exporter of high-definition digital wall tiles, glazed vitrified tiles, porcelain slabs, and decorative ceramic panels based in Morbi ceramic hub.',
  productCategories: [
    'Carving Finish Vitrified Tiles (600x1200mm)',
    'Glossy & High Gloss Living Room Tiles',
    'Matte Textured Architectural Slabs (800x1600mm)',
    'Subway Decorative Kitchen Wall Tiles (300x600mm)',
    'Outdoor Heavy-Duty Full Body Porcelain Pavers',
    'Royal Gold Metallic Highlighter Ceramic Tiles'
  ]
};

// FRESH CLEAN META CONFIG: NOT CONNECTED UNTIL USER ENTERS CREDENTIALS
export const INITIAL_META_CONFIG: MetaConfig = {
  appId: '',
  wabaId: '',
  phoneNumberId: '',
  displayPhoneNumber: '+91 90992 68044',
  businessName: 'LAXTONE CERAMIC',
  qualityRating: 'UNKNOWN',
  messagingLimit: 'TIER_NOT_CONNECTED',
  status: 'DISCONNECTED',
  coexistenceEnabled: false,
  coexistenceStatus: 'DISCONNECTED',
  webhookStatus: 'PENDING_SETUP',
  tokenStatus: 'INVALID',
  lastSyncTime: 'Awaiting Official Meta Cloud API Credentials',
  isDemoMode: false
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Rajesh Patel',
    email: 'info.rangerceramic416@gmail.com',
    phone: '+91 90992 68044',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    activeChatsCount: 0,
    status: 'online',
    assignedDepartment: 'Sales & Operations'
  }
];

export const INITIAL_CONTACTS: Contact[] = [];
export const INITIAL_SEGMENTS: AudienceSegment[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];
export const INITIAL_MESSAGES_CONV_1: WhatsAppMessage[] = [];

// Fresh empty templates array (user creates and submits with official fields)
export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [];

export const INITIAL_AI_AGENT: AIAgentConfig = {
  aiName: 'Laxtone AI Sales Executive',
  enabled: true,
  systemInstruction: 'You are an intelligent WhatsApp AI sales executive for Laxtone Ceramic in Morbi, Gujarat. Assist buyers with tile dimensions, finishes, wholesale dealership queries, and handover to sales manager when requested.',
  tone: 'professional',
  supportedLanguages: ['en', 'hi', 'gu'],
  businessInfo: {
    companyName: 'LAXTONE CERAMIC',
    industry: 'Tiles & Ceramic Manufacturing',
    productsSummary: 'GVT, PGVT, Wall Tiles, Porcelain Slabs, Full Body Pavers',
    catalogues: [],
    pricePolicy: 'Ex-Factory Morbi prices',
    contactSupport: '+91 90992 68044'
  },
  maxAITurnsBeforeHandover: 3,
  handoverTriggers: {
    priceNegotiation: true,
    customerRequestedHuman: true,
    complaintDetected: true,
    lowConfidence: true
  }
};

export const INITIAL_MEDIA: MediaAsset[] = [];
export const INITIAL_CTWA_LEADS: ClickToWhatsAppLead[] = [];
export const INITIAL_FLOWS: FlowItem[] = [];
export const INITIAL_FORMS: FormItem[] = [];
export const INITIAL_WEBHOOK_LOGS: WebhookLog[] = [];
