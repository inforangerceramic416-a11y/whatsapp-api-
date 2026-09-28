export interface UserAccount {
  id: string;
  mobile: string;
  email: string;
  password?: string;
  city: string;
  role: 'master' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  tenantId: string;
  businessName: string;
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export interface SystemVersion {
  sequence: number;
  versionCode: string; // e.g. "ver - 1001"
  releaseNotes: string;
  updatedAt: string;
  updatedBy: string;
  globalNotice?: string;
}

export interface MetaConfig {
  appId: string;
  businessPortfolioId?: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  businessName: string;
  qualityRating: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';
  messagingLimit: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING_VERIFICATION' | 'RESTRICTED';
  coexistenceEnabled: boolean;
  coexistenceStatus: 'CONNECTED' | 'NOT_CONNECTED' | 'NOT_ELIGIBLE' | 'DISCONNECTED';
  webhookStatus: 'ACTIVE' | 'PENDING' | 'ERROR' | 'PENDING_SETUP';
  tokenStatus: 'VALID' | 'EXPIRED' | 'MISSING' | 'INVALID';
  lastSyncTime: string;
  isDemoMode: boolean;
  permanentToken?: string;
}

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'business' | 'system' | 'bot';
  senderName?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'template' | 'interactive' | 'location';
  text?: string;
  mediaUrl?: string;
  mediaFileName?: string;
  mediaCaption?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  errorCode?: string;
  errorMessage?: string;
  templateName?: string;
  interactiveData?: {
    header?: string;
    body: string;
    footer?: string;
    buttons?: Array<{ id: string; title: string }>;
  };
  isEchoFromApp?: boolean; // WhatsApp Business App mobile coexistence echo
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  lastMessage: string;
  lastMessageType: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  assignedAgentId?: string;
  assignedAgentName?: string;
  tags: string[];
  status: 'open' | 'closed' | 'archived' | 'pending';
  aiAssisted?: boolean;
  aiHandover?: boolean;
  isCoexistenceActive?: boolean;
  notes?: Array<{ id: string; author: string; text: string; createdAt: string }>;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  country: string;
  company: string;
  city: string;
  email: string;
  tags: string[];
  customFields: Record<string, string>;
  leadSource: 'Click-to-WhatsApp' | 'Website' | 'Trade Fair' | 'Direct Message' | 'Referral' | 'CSV Import';
  assignedAgentId?: string;
  assignedAgentName?: string;
  createdAt: string;
  lastConversationAt: string;
  optInStatus: 'OPTED_IN' | 'OPTED_OUT' | 'UNCONFIRMED';
  segmentIds?: string[];
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  filterCriteria: {
    tags?: string[];
    city?: string;
    leadSource?: string;
    optInOnly?: boolean;
  };
  contactCount: number;
  createdAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  metaTemplateId?: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT' | 'PAUSED' | 'DISABLED';
  headerType: 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  headerText?: string;
  headerMediaUrl?: string;
  bodyText: string;
  exampleVariables: string[];
  footerText?: string;
  buttons: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phoneNumber?: string;
  }>;
  categoryChangedByMeta?: {
    originalCategory: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
    newCategory: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
    reason: string;
  };
  rejectionReason?: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  category: 'MARKETING' | 'UTILITY';
  audienceType: 'all' | 'segment' | 'tag' | 'csv' | 'custom_numbers';
  manualNumbersCount?: number;
  variableValues?: Record<string, string>;
  targetSegmentName?: string;
  targetTag?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  repliedCount: number;
  status: 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  scheduledAt: string;
  createdAt: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type: 'INCOMING_MESSAGE' | 'KEYWORD' | 'NEW_CONTACT' | 'TAG_ADDED' | 'CLICK_TO_WHATSAPP';
    keyword?: string;
    tag?: string;
  };
  steps: Array<{
    id: string;
    action: 'SEND_TEXT' | 'SEND_TEMPLATE' | 'ADD_TAG' | 'ASSIGN_AGENT' | 'WAIT_DELAY' | 'AI_REPLY' | 'CONDITION_CHECK';
    params: Record<string, any>;
  }>;
  runsCount: number;
  lastTriggeredAt?: string;
}

export interface AIAgentConfig {
  aiName: string;
  enabled: boolean;
  systemInstruction: string;
  tone: 'professional' | 'friendly' | 'concise' | 'consultative';
  supportedLanguages: string[];
  businessInfo: {
    companyName: string;
    industry: string;
    productsSummary: string;
    catalogues: string[];
    pricePolicy: string;
    contactSupport: string;
  };
  maxAITurnsBeforeHandover: number;
  handoverTriggers: {
    priceNegotiation: boolean;
    customerRequestedHuman: boolean;
    complaintDetected: boolean;
    lowConfidence: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'VIEWER';
  avatar: string;
  activeChatsCount: number;
  status: 'online' | 'busy' | 'offline';
  assignedDepartment: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  category: 'Images' | 'Videos' | 'Documents' | 'PDF' | 'Catalogue';
  url: string;
  size: string;
  format: string;
  uploadedAt: string;
  metaHandle?: string;
}

export interface ClickToWhatsAppLead {
  id: string;
  adName: string;
  campaignName: string;
  adSource: string;
  customerName: string;
  customerPhone: string;
  firstMessage: string;
  assignedAgent: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  createdAt: string;
}

export interface FlowItem {
  id: string;
  name: string;
  status: 'PUBLISHED' | 'DRAFT' | 'DEPRECATED';
  categories: string[];
  screensCount: number;
  jsonDefinition: string;
  updatedAt: string;
}

export interface FormItem {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'phone' | 'dropdown' | 'date';
    required: boolean;
    options?: string[];
  }>;
  submissionsCount: number;
  triggerAutomationId?: string;
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  event: string;
  status: 'SUCCESS' | 'ERROR' | 'RETRY';
  statusCode: number;
  payload: string;
  timestamp: string;
}
