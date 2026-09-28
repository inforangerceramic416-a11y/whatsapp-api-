import { MetaConfig, WhatsAppMessage, WhatsAppTemplate } from '../types';

/**
 * Meta WhatsApp Cloud API Service (v21.0)
 * 
 * Uses official endpoints:
 * - Graph API: https://graph.facebook.com/v21.0/{phone-number-id}/messages
 * - Template Management: https://graph.facebook.com/v21.0/{waba-id}/message_templates
 * - Business Profile: https://graph.facebook.com/v21.0/{phone-number-id}/whatsapp_business_profile
 * 
 * In production, calls are routed via server-side proxies or using secure server-side env vars.
 */

export interface MetaApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
  httpStatus?: number;
}

export class MetaWhatsAppClient {
  private apiVersion = 'v21.0';
  private baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

  /**
   * Send WhatsApp Message via official Cloud API
   * POST /v21.0/{phone-number-id}/messages
   */
  async sendMessage(
    phoneNumberId: string,
    to: string,
    content: {
      type: 'text' | 'template' | 'interactive' | 'document' | 'image';
      text?: string;
      template?: {
        name: string;
        language: { code: string };
        components?: any[];
      };
      mediaUrl?: string;
      mediaCaption?: string;
    },
    accessToken?: string
  ): Promise<MetaApiResponse<{ messageId: string }>> {
    const formattedRecipient = to.replace(/[^0-9]/g, '');

    // If no real token provided or in Demo Mode, simulate official response contract
    if (!accessToken || accessToken === 'DEMO_MODE') {
      const mockWamid = `wamid.HBgL${formattedRecipient}v21${Date.now()}`;
      return {
        success: true,
        httpStatus: 200,
        data: { messageId: mockWamid }
      };
    }

    try {
      const bodyPayload: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedRecipient,
        type: content.type
      };

      if (content.type === 'text') {
        bodyPayload.text = { preview_url: true, body: content.text };
      } else if (content.type === 'template' && content.template) {
        bodyPayload.template = content.template;
      } else if (content.type === 'document' && content.mediaUrl) {
        bodyPayload.document = { link: content.mediaUrl, caption: content.mediaCaption };
      } else if (content.type === 'image' && content.mediaUrl) {
        bodyPayload.image = { link: content.mediaUrl, caption: content.mediaCaption };
      }

      const response = await fetch(`${this.baseUrl}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          httpStatus: response.status,
          error: json.error || {
            message: 'Meta WhatsApp API returned an error',
            code: response.status,
            type: 'OAuthException'
          }
        };
      }

      return {
        success: true,
        httpStatus: response.status,
        data: { messageId: json.messages?.[0]?.id || `wamid.${Date.now()}` }
      };
    } catch (err: any) {
      return {
        success: false,
        httpStatus: 500,
        error: {
          message: err.message || 'Network error communicating with Meta Graph API',
          code: -1,
          type: 'NetworkError'
        }
      };
    }
  }

  /**
   * Submit WhatsApp Message Template to Meta for Approval
   * POST /v21.0/{waba-id}/message_templates
   */
  async submitTemplate(
    wabaId: string,
    templateData: {
      name: string;
      category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
      language: string;
      components: any[];
    },
    accessToken?: string
  ): Promise<MetaApiResponse<{ id: string; status: string }>> {
    if (!accessToken || accessToken === 'DEMO_MODE') {
      return {
        success: true,
        httpStatus: 200,
        data: {
          id: `tmpl_${Date.now()}`,
          status: 'PENDING'
        }
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/${wabaId}/message_templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: templateData.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          category: templateData.category,
          language: templateData.language,
          components: templateData.components
        })
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          httpStatus: response.status,
          error: json.error || {
            message: 'Failed to create template on Meta Cloud API',
            code: response.status,
            type: 'MetaTemplateError'
          }
        };
      }

      return {
        success: true,
        httpStatus: response.status,
        data: {
          id: json.id,
          status: json.status || 'PENDING'
        }
      };
    } catch (err: any) {
      return {
        success: false,
        httpStatus: 500,
        error: {
          message: err.message || 'Error creating Meta template',
          code: -1,
          type: 'NetworkError'
        }
      };
    }
  }

  /**
   * Fetch WABA Phone Number Quality & Coexistence Status
   * GET /v21.0/{phone-number-id}?fields=verified_name,code_verification_status,display_phone_number,quality_rating,messaging_limit_tier,throughput
   */
  async getPhoneNumberStatus(
    phoneNumberId: string,
    accessToken?: string
  ): Promise<MetaApiResponse<any>> {
    if (!accessToken || accessToken === 'DEMO_MODE') {
      return {
        success: true,
        httpStatus: 200,
        data: {
          verified_name: 'LAXTONE CERAMIC',
          display_phone_number: '+91 90992 68044',
          quality_rating: 'GREEN',
          messaging_limit_tier: 'TIER_50K',
          coexistence_status: 'CONNECTED'
        }
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${phoneNumberId}?fields=verified_name,display_phone_number,quality_rating,messaging_limit_tier`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      const json = await response.json();
      if (!response.ok) {
        return { success: false, error: json.error, httpStatus: response.status };
      }
      return { success: true, data: json, httpStatus: response.status };
    } catch (err: any) {
      return {
        success: false,
        error: { message: err.message, code: -1, type: 'Network' }
      };
    }
  }
}

export const metaApiClient = new MetaWhatsAppClient();
