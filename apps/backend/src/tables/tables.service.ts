import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async getAreasAndTables(tenantId: string) {
    return this.prisma.restaurantArea.findMany({
      where: { tenantId },
      include: { tables: true },
    });
  }

  async createArea(tenantId: string, data: any) {
    return this.prisma.restaurantArea.create({
      data: { ...data, tenantId },
    });
  }

  async createTable(tenantId: string, areaId: string, data: any) {
    // Basic verification that area belongs to tenant
    const area = await this.prisma.restaurantArea.findFirst({
      where: { id: areaId, tenantId },
    });
    if (!area) throw new Error('Area not found');

    return this.prisma.table.create({
      data: { ...data, areaId },
    });
  }
}
