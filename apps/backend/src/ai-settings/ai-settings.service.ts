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
}
