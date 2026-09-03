import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UpsellEngine {
  constructor(private prisma: PrismaService) {}

  async getUpsellContext(tenantId: string): Promise<string> {
    const settings = await this.prisma.aiSettings.findUnique({
      where: { tenantId }
    });

    if (!settings || !settings.upsellingEnabled) {
      return "Do not attempt to upsell items.";
    }

    // Default upsell strategies injected into the prompt
    return `
1. When a user orders a main course, ask if they would like to add a drink or side.
2. If the user mentions a special occasion, suggest premium add-ons or desserts.
3. Keep upsell suggestions brief and natural (max 1 sentence).
    `.trim();
  }
}
