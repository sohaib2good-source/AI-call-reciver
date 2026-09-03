import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryPickupService {
  constructor(private prisma: PrismaService) {}

  async getDeliverySettings(tenantId: string) {
    return this.prisma.deliverySettings.findUnique({ where: { tenantId } });
  }

  async updateDeliverySettings(tenantId: string, data: any) {
    return this.prisma.deliverySettings.upsert({
      where: { tenantId },
      create: { ...data, tenantId },
      update: data,
    });
  }

  async getPickupSettings(tenantId: string) {
    return this.prisma.pickupSettings.findUnique({ where: { tenantId } });
  }

  async updatePickupSettings(tenantId: string, data: any) {
    return this.prisma.pickupSettings.upsert({
      where: { tenantId },
      create: { ...data, tenantId },
      update: data,
    });
  }
}
