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
      include: { aiSettings: true, businessHours: true },
    });

    const aiSettings = tenant?.aiSettings;
    const basePrompt =
      aiSettings?.systemPrompt ||
      `You are an intelligent, polite, and helpful phone receptionist for ${tenant?.name}.`;

    // Inject contextual knowledge
    let fullPrompt = `${basePrompt}\n\n`;

    fullPrompt += `--- RESTAURANT CONTEXT ---\n`;
    fullPrompt += `Name: ${tenant?.name}\n`;
    fullPrompt += `Phone: ${tenant?.phoneNumbers[0] || 'N/A'}\n`;
    fullPrompt += `Tone: ${aiSettings?.tone || 'Professional and warm'}\n`;

    // Inject Business Operating Hours & Holidays
    const todayStr = new Date().toISOString().split('T')[0];
    const allHours = tenant?.businessHours || [];
    const holidays = allHours.filter(
      (h) => (h.type as string) === 'HOLIDAY' || (h.type as string) === 'TEMPORARY_CLOSURE'
    );

    fullPrompt += `\n--- OPERATING SHIFTS & SPECIAL HOLIDAY CLOSURES ---\n`;
    fullPrompt += `Today's Date: ${todayStr}\n`;

    // Check if today is a holiday
    const todayHoliday = holidays.find((h) => {
      if (!h.startDate) return false;
      const start = new Date(h.startDate).toISOString().split('T')[0];
      const end = h.endDate ? new Date(h.endDate).toISOString().split('T')[0] : start;
      return todayStr >= start && todayStr <= end;
    });

    if (todayHoliday) {
      const hName = (todayHoliday as any).name || todayHoliday.openTime || 'Special Holiday';
      const hNote =
        (todayHoliday as any).notes ||
        todayHoliday.closeTime ||
        `Our restaurant is closed today for ${hName}. We look forward to serving you tomorrow!`;

      fullPrompt += `\n🚨 CRITICAL ALERT: THE RESTAURANT IS CLOSED TODAY FOR: ${hName.toUpperCase()}!\n`;
      fullPrompt += `ANNOUNCEMENT TO CALLERS: "${hNote}"\n`;
      fullPrompt += `MANDATORY INSTRUCTION: If a customer calls asking to order food, book a table, or visit today, you MUST immediately inform them that the restaurant is closed today for ${hName}.\n`;
    } else {
      fullPrompt += `Today's Status: OPEN for regular scheduled operating shifts.\n`;
    }

    if (holidays.length > 0) {
      fullPrompt += `\nScheduled Holiday Closures (Up to 15):\n`;
      holidays.slice(0, 15).forEach((h) => {
        const start = h.startDate ? new Date(h.startDate).toISOString().split('T')[0] : 'N/A';
        const end = h.endDate ? new Date(h.endDate).toISOString().split('T')[0] : start;
        const name = (h as any).name || h.openTime || 'Holiday Closure';
        const dateRange = start === end ? start : `${start} to ${end}`;
        fullPrompt += `- ${dateRange}: ${name} (All shifts closed)\n`;
      });
      fullPrompt += `INSTRUCTION: If a caller inquires about or requests a reservation or takeaway order for any of these specific holiday dates, politely inform them: "I'm sorry, our restaurant will be closed on that day for [Holiday Name]."\n`;
    }

    // Inject Upsell Rules
    const upsellContext = await this.upsellEngine.getUpsellContext(tenantId);
    fullPrompt += `\n--- UPSELL STRATEGY ---\n${upsellContext}\n`;

    // Inject Delivery & Pickup Fulfillment Rules (JSON-Aligned)
    const delivery = await this.prisma.deliverySettings.findUnique({ where: { tenantId } });
    const pickup = await this.prisma.pickupSettings.findUnique({ where: { tenantId } });

    fullPrompt += `\n--- DELIVERY & PICKUP FULFILLMENT RULES (JSON-ALIGNED) ---\n`;

    // 1. Delivery Estimated Time (Strict blank check)
    if (delivery?.estimatedDeliveryMins && Number(delivery.estimatedDeliveryMins) > 0) {
      fullPrompt += `- ESTIMATED DELIVERY TIME: ${delivery.estimatedDeliveryMins} minutes. When a caller asks how much time is required or how long delivery takes, inform them: "Our estimated delivery time is approximately ${delivery.estimatedDeliveryMins} minutes."\n`;
    } else {
      fullPrompt += `- ESTIMATED DELIVERY TIME: [SPACE LEFT BLANK]. STRICT COMPLIANCE RULE: The restaurant has not configured a delivery time estimate. Do NOT state, guess, or promise ANY delivery duration or timeframe to the caller. If asked how long it takes, say: "Delivery times vary based on current kitchen order volume and traffic. Our team will keep you updated once your order is dispatched."\n`;
    }

    // 2. Pickup Preparation Time (Strict blank check)
    if (pickup?.preparationTimeMins && Number(pickup.preparationTimeMins) > 0) {
      fullPrompt += `- PICKUP PREPARATION TIME: ${pickup.preparationTimeMins} minutes. When a caller asks when their pickup order will be ready, inform them: "Pickup orders are typically ready in about ${pickup.preparationTimeMins} minutes."\n`;
    } else {
      fullPrompt += `- PICKUP PREPARATION TIME: [SPACE LEFT BLANK]. STRICT COMPLIANCE RULE: The restaurant has not configured a pickup preparation time. Do NOT state or guess ANY preparation time. Say: "Your order will be prepared fresh and our team will notify you as soon as it is ready for collection."\n`;
    }

    // 3. Delivery Radius, Minimum Order & Fee
    if (delivery?.deliveryRadiusKm && Number(delivery.deliveryRadiusKm) > 0) {
      fullPrompt += `- DELIVERY RADIUS: Up to ${delivery.deliveryRadiusKm} km.\n`;
    }
    if (delivery?.minimumOrder && Number(delivery.minimumOrder) > 0) {
      fullPrompt += `- MINIMUM ORDER: $${Number(delivery.minimumOrder).toFixed(2)} for delivery orders.\n`;
    }
    const delFee = (delivery?.deliveryFees as any)?.baseFee;
    if (delFee && Number(delFee) > 0) {
      fullPrompt += `- DELIVERY FEE: $${Number(delFee).toFixed(2)} standard delivery fee.\n`;
    }

    if (pickup?.pickupInstructions) {
      fullPrompt += `- PICKUP INSTRUCTIONS: "${pickup.pickupInstructions}"\n`;
    }

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
