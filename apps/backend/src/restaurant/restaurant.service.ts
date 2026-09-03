import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async getProfile(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { address: true },
    });
  }

  async updateProfile(tenantId: string, data: any) {
    const { address, ...tenantData } = data;
    
    // Create Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Tenant',
        entityId: tenantId,
        details: data,
        tenantId,
      }
    });

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...tenantData,
        ...(address && {
          address: {
            upsert: {
              create: address,
              update: address,
            }
          }
        })
      },
      include: { address: true },
    });
  }
}
