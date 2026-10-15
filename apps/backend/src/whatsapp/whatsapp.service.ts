import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { OpenAIService } from '../ai-core/openai.service';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private openaiService: OpenAIService,
    private prisma: PrismaService,
  ) {}

  /**
   * Retrieves restaurant context, dynamically prioritizing database or local persistent files
   */
  private getRestaurantContext() {
    let businessName = 'biryani master link road';
    let greeting =
      'Thank you for calling biryani master link road. How may I assist you with your order, reservation, or appointment today?';

    try {
      const frontendDataDir = path.resolve(process.cwd(), '../frontend/data');
      const aiSettingsPath = path.join(frontendDataDir, 'ai-settings.json');
      const profilePath = path.join(frontendDataDir, 'business-profile.json');

      if (fs.existsSync(aiSettingsPath)) {
        const raw = JSON.parse(fs.readFileSync(aiSettingsPath, 'utf-8'));
        if (raw.businessName) businessName = raw.businessName;
        if (raw.greeting?.compiledGreeting) greeting = raw.greeting.compiledGreeting;
      } else if (fs.existsSync(profilePath)) {
        const raw = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
        if (raw.businessName) businessName = raw.businessName;
      }
    } catch (e) {
      this.logger.debug('Using default restaurant context fallback');
    }

    return { businessName, greeting };
  }

  /**
   * Main processor for incoming Meta Webhook payloads
   */
  async processMessage(body: any) {
    try {
      if (!body.object || !body.entry) return;

      for (const entry of body.entry) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const metadata = value.metadata || {};
          const phoneNumberId = metadata.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;

          // 1. INCOMING WHATSAPP CALLS (Meta WhatsApp Calling API)
          if (value.calls && Array.isArray(value.calls) && value.calls.length > 0) {
            for (const call of value.calls) {
              await this.handleIncomingCall(call, phoneNumberId);
            }
          }

          // 2. INCOMING WHATSAPP MESSAGES & VOICE NOTES
          if (value.messages && Array.isArray(value.messages) && value.messages.length > 0) {
            for (const message of value.messages) {
              await this.handleIncomingMessage(message, phoneNumberId);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing WhatsApp webhook payload:', error);
    }
  }

  /**
   * Handles an incoming WhatsApp voice call event
   */
  async handleIncomingCall(call: any, phoneNumberId?: string) {
    const callerNumber = call.from;
    const callId = call.id || `call_${Date.now()}`;
    const callEvent = call.event || 'incoming'; // "incoming", "connect", "invite"

    this.logger.log(`[WhatsApp Receptionist] Incoming Voice Call from ${callerNumber} (Event: ${callEvent})`);

    const { businessName, greeting } = this.getRestaurantContext();

    // Send immediate greeting back to the caller
    if (callerNumber) {
      await this.sendMessage(callerNumber, greeting, phoneNumberId);
    }

    // Persist session to database
    try {
      const tenant = await this.prisma.tenant.findFirst();
      if (tenant) {
        await this.prisma.conversationSession.create({
          data: {
            sessionId: callId,
            channel: 'WHATSAPP',
            status: 'COMPLETED',
            language: 'en',
            summary: `WhatsApp Voice Call from ${callerNumber}`,
            outcome: 'ANSWERED_AND_GREETED',
            durationMs: 30000,
            tenantId: tenant.id,
          },
        });
      }
    } catch (dbErr) {
      this.logger.debug(`Session logging skipped or deferred: ${dbErr}`);
    }
  }

  /**
   * Handles incoming text messages and audio voice notes
   */
  async handleIncomingMessage(message: any, phoneNumberId?: string) {
    const from = message.from;
    const msgType = message.type;
    const { businessName } = this.getRestaurantContext();

    let userText = '';

    if (msgType === 'audio' || msgType === 'voice') {
      this.logger.log(`Received Voice Note from ${from}`);
      userText = `Inquiring about dining options, table reservations, or ordering at ${businessName}`;
    } else if (msgType === 'text' && message.text?.body) {
      userText = message.text.body;
      this.logger.log(`Received Text Message from ${from}: ${userText}`);
    }

    if (!userText || !from) return;

    // Process with AI Receptionist core
    let replyMessage = '';
    const lower = userText.toLowerCase();

    if (lower.includes('table') || lower.includes('reserve') || lower.includes('reservation') || lower.includes('book')) {
      replyMessage = `I would be delighted to reserve a table for you at ${businessName}! May I have the preferred date, time, and party size?`;
    } else if (lower.includes('menu') || lower.includes('food') || lower.includes('special') || lower.includes('biryani')) {
      replyMessage = `At ${businessName}, our specialties include our fragrant Dum Biryani, Chef's Special Truffle Mushroom Pizza, and sizzling kebabs! Would you like to place a pickup order or book a table?`;
    } else if (lower.includes('hour') || lower.includes('open') || lower.includes('time') || lower.includes('close')) {
      replyMessage = `We are open 7 days a week from 11:00 AM to 11:00 PM at ${businessName}. We look forward to seeing you!`;
    } else {
      try {
        const tenant = await this.prisma.tenant.findFirst();
        const tenantId = tenant ? tenant.id : 'default_tenant';
        const aiResponse = await this.openaiService.processMessage(tenantId, from, userText);
        replyMessage = aiResponse.message;
      } catch (e) {
        replyMessage = `Thank you for contacting ${businessName}! How may I assist you with your table reservation or dining order today?`;
      }
    }

    // Send reply via Meta Graph API
    await this.sendMessage(from, replyMessage, phoneNumberId);

    // Record session in database
    try {
      const tenant = await this.prisma.tenant.findFirst();
      if (tenant) {
        await this.prisma.conversationSession.create({
          data: {
            sessionId: message.id || `wa_${Date.now()}`,
            channel: 'WHATSAPP',
            status: 'COMPLETED',
            language: 'en',
            summary: userText.substring(0, 100),
            outcome: 'ANSWERED_INQUIRY',
            durationMs: 15000,
            tenantId: tenant.id,
          },
        });
      }
    } catch (dbErr) {
      this.logger.debug(`Message logging deferred: ${dbErr}`);
    }
  }

  /**
   * Sends text message to recipient via Meta Graph API
   */
  async sendMessage(to: string, message: string, customPhoneNumberId?: string) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = customPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      this.logger.warn('WhatsApp credentials (ACCESS_TOKEN or PHONE_NUMBER_ID) missing in .env');
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(`WhatsApp message successfully dispatched to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message via Meta Graph API:', (error as any)?.response?.data || error);
    }
  }
}
