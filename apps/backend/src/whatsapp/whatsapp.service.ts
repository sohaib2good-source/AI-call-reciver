import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { OpenAIService } from '../ai-core/openai.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private openaiService: OpenAIService) {}

  async processMessage(body: any) {
    try {
      if (body.object) {
        if (
          body.entry &&
          body.entry[0].changes &&
          body.entry[0].changes[0] &&
          body.entry[0].changes[0].value.messages &&
          body.entry[0].changes[0].value.messages[0]
        ) {
          const phone_number_id =
            body.entry[0].changes[0].value.metadata.phone_number_id;
          const from = body.entry[0].changes[0].value.messages[0].from; 
          const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

          this.logger.log(`Received message from ${from}: ${msg_body}`);

          // Send to OpenAI
          // We use the phone number as the session ID, and a default tenant ID for now
          const tenantId = 'default_tenant';
          const aiResponse = await this.openaiService.processMessage(tenantId, from, msg_body);

          await this.sendMessage(from, aiResponse.message);
        }
      }
    } catch (error) {
      this.logger.error('Error processing WhatsApp message:', error);
    }
  }

  async sendMessage(to: string, message: string) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phone_number_id = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phone_number_id) {
      this.logger.error('WhatsApp credentials are not configured in .env');
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
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
      this.logger.log(`Message sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message', (error as any)?.response?.data || error);
    }
  }
}
