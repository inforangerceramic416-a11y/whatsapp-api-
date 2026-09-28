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
    role: 'Admin',
    department: 'Sales & Operations',
    activeConversations: 0,
    status: 'online',
    isAiAssistant: false
  }
];

export const INITIAL_CONTACTS: Contact[] = [];
export const INITIAL_SEGMENTS: AudienceSegment[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];
export const INITIAL_MESSAGES_CONV_1: WhatsAppMessage[] = [];

// Fresh empty templates array (user creates and submits with official fields)
export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'auto-1',
    name: 'Dealer E-Catalogue Auto-Sender',
    description: 'When dealer asks for price or catalogue, auto-send official PDF with company profile.',
    triggerType: 'KEYWORD_MATCH',
    triggerValue: 'price, catalogue, catalogue pdf, rate list, sample',
    actionType: 'SEND_TEMPLATE',
    actionPayload: 'laxtone_catalogue_launch_2026',
    isActive: true,
    triggeredCount: 0
  }
];

export const INITIAL_AI_AGENT: AIAgentConfig = {
  id: 'ai-bot-laxtone',
  name: 'Laxtone AI Sales Executive',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  description: 'AI ceramic tile consultant trained on Morbi manufacturing specifications, slab sizes, export container logistics, and dealer qualification.',
  personality: 'PROFESSIONAL',
  knowledgeBase: {
    companyName: 'LAXTONE CERAMIC',
    factoryLocation: 'Morbi, Gujarat, India (Ceramic Capital of India)',
    specialties: 'Carving tiles (600x1200mm), Porcelain slabs (800x1600mm), Wall tiles (300x600mm), Heavy pavers',
    minOrderQuantity: '1 FCL Container for exports (Approx 1400-1800 boxes) or 1 truckload (approx 1200 boxes) for domestic Morbi dealers.',
    exportPorts: 'Mundra Port & Pipavav Port, Gujarat, India',
    pricingNote: 'Prices are Ex-Factory Morbi excluding GST and freight charges. Discounts apply on volumes above 2500 boxes.'
  },
  handoverRules: [
    'Customer asks for credit terms longer than 30 days',
    'Customer demands custom packaging or private OEM tile labeling',
    'Price discount requested above 15% from wholesale list',
    'Complaint regarding transit breakage or tile shade variance'
  ],
  enabled: true,
  autoReplyDelaySeconds: 2
};

export const INITIAL_MEDIA: MediaAsset[] = [];
export const INITIAL_CTWA_LEADS: ClickToWhatsAppLead[] = [];
export const INITIAL_FLOWS: FlowItem[] = [];
export const INITIAL_FORMS: FormItem[] = [];
export const INITIAL_WEBHOOK_LOGS: WebhookLog[] = [];
