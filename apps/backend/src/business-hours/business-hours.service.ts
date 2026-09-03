import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessHoursService {
  constructor(private prisma: PrismaService) {}

  async getHours(tenantId: string) {
    return this.prisma.businessHours.findMany({
      where: { tenantId },
    });
  }

  async updateHours(tenantId: string, hours: any[]) {
    // Delete existing and recreate for simplicity in this sprint
    await this.prisma.businessHours.deleteMany({
      where: { tenantId },
    });

    const data = hours.map(h => ({ ...h, tenantId }));
    await this.prisma.businessHours.createMany({
      data,
    });

    return this.getHours(tenantId);
  }
}
