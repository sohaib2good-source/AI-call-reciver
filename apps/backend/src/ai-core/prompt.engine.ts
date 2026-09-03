import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsellEngine } from './upsell.engine';

@Injectable()
export class PromptEngine {
  constructor(
    private prisma: PrismaService,
    private upsellEngine: UpsellEngine
  ) {}

  async compileSystemPrompt(tenantId: string, customerId?: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { aiSettings: true, businessHours: true }
    });

    const aiSettings = tenant?.aiSettings;
    const basePrompt = aiSettings?.systemPrompt || `You are a helpful restaurant receptionist for ${tenant?.name}.`;
    
    // Inject contextual knowledge
    let fullPrompt = `${basePrompt}\n\n`;
    
    fullPrompt += `--- RESTAURANT CONTEXT ---\n`;
    fullPrompt += `Name: ${tenant?.name}\n`;
    fullPrompt += `Phone: ${tenant?.phoneNumbers[0] || 'N/A'}\n`;
    fullPrompt += `Tone: ${aiSettings?.tone || 'Professional and warm'}\n`;
    
    // Inject Upsell Rules
    const upsellContext = await this.upsellEngine.getUpsellContext(tenantId);
    fullPrompt += `\n--- UPSELL STRATEGY ---\n${upsellContext}\n`;

    // Inject Safety Guardrails
    fullPrompt += `\n--- GUARDRAILS ---\n`;
    fullPrompt += `- NEVER invent menu items. Always use the searchMenu tool.\n`;
    fullPrompt += `- NEVER invent prices. Always use the calculateOrder tool.\n`;
    fullPrompt += `- NEVER confirm a reservation without using the checkAvailability tool.\n`;
    if (aiSettings?.escalationRules) {
      fullPrompt += `- ESCALATION: ${JSON.stringify(aiSettings.escalationRules)}\n`;
    }

    return fullPrompt;
  }
}
