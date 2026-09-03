import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(tenantId: string) {
    return this.prisma.aiSettings.findUnique({ where: { tenantId } });
  }

  async updateSettings(tenantId: string, data: any) {
    return this.prisma.aiSettings.upsert({
      where: { tenantId },
      create: { ...data, tenantId },
      update: data,
    });
  }

  async getAgentConfig(tenantId: string) {
    const settings = await this.getSettings(tenantId);
    const autoAnswering = (settings?.businessRules as any)?.autoAnswering ?? {
      enabled: true,
      rings: 2,
      seconds: 6,
      mode: 'DELAYED',
      strategy: 'STAFF_FIRST',
    };

    const rings = autoAnswering.rings ?? 2;
    const seconds = rings * 3;

    return {
      ai_agent_status: autoAnswering.enabled ? 'ACTIVE' : 'DISABLED',
      auto_answering: {
        enabled: autoAnswering.enabled ?? true,
        pickup_delay: {
          rings,
          seconds,
          mode: rings === 1 ? 'IMMEDIATE' : 'DELAYED',
          strategy:
            rings === 1
              ? 'IMMEDIATE_PICKUP'
              : rings === 2
              ? 'QUICK_PICKUP'
              : rings === 3
              ? 'STAFF_FIRST'
              : rings === 4
              ? 'STAFF_PRIORITY'
              : 'MAX_DELAY',
          description: `Wait ${rings} ring(s) (~${seconds}s) before AI receptionist answers call.`,
        },
        operating_hours_only: false,
      },
      voice_persona: {
        voice_id: settings?.voicePersonality || 'friendly-female-en',
        tone: settings?.tone || 'Warm & Professional',
        languages: settings?.supportedLanguages || ['en-US'],
        greeting:
          settings?.greeting ||
          'Welcome to AI Restaurant! How can I assist you with your reservation or order today?',
      },
      active_skills: settings?.enabledTools || [
        'food_ordering',
        'table_reservations',
        'faq_and_hours',
        'customer_lookup',
      ],
      escalation: {
        transfer_on_failure: true,
        max_unrecognized_intents: 2,
        transfer_phone_number:
          (settings?.transferRules as any)?.phone || '+1 (555) 019-2834',
      },
      telephony: {
        provider_support: ['TWILIO', 'VAPI', 'RETELL', 'SIP_IVR'],
        action: autoAnswering.enabled ? 'AI_AUTO_PICKUP' : 'FORWARD_TO_STAFF',
        ring_timeout_ms: seconds * 1000,
      },
      conversational_upselling_addons: {
        categories: {
          enabled: true,
          agent_behavior: 'AGENT_WILL_ASK',
          prompt_script: 'Would you like to start with any appetizers or beverage specials today?',
          trigger: 'AFTER_FIRST_ITEM',
        },
        menu_items: {
          enabled: true,
          agent_behavior: 'AGENT_WILL_ASK',
          prompt_script: "Our Chef's Special Truffle Pasta is very popular today. Would you like to try it?",
          trigger: 'ON_RECOMMENDATION_REQUEST',
        },
        modifiers_and_addons: {
          enabled: true,
          agent_behavior: 'AGENT_WILL_ASK',
          prompt_script: 'Would you like to add extra cheese, bacon, avocado, or premium sauces to that?',
          trigger: 'ON_ITEM_SELECTED',
        },
        combos_and_deals: {
          enabled: false,
          agent_behavior: 'AGENT_WILL_NOT_ASK',
          prompt_script: 'Would you like to upgrade your order into a combo meal with fries and a drink for $3.50?',
          trigger: 'BEFORE_CHECKOUT',
        },
      },
    };
  }
}
