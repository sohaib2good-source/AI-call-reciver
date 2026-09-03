import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KdsService {
  constructor(private prisma: PrismaService) {}

  // Routes order items to appropriate kitchen stations
  async routeToStations(tenantId: string, orderId: string, items: any[]) {
    // In reality, this would look up the kitchenStationId from the MenuItem
    // and assign it to the OrderItem
    return true; // Simplified for prototype
  }

  async getStationQueue(tenantId: string, stationId?: string) {
    const where: any = {
      order: { tenantId, status: { in: ['KITCHEN_ACCEPTED', 'PREPARING', 'COOKING'] } },
      kitchenStatus: { in: ['PENDING', 'PREPARING', 'COOKING'] }
    };

    if (stationId) {
      where.kitchenStationId = stationId;
    }

    return this.prisma.orderItem.findMany({
      where,
      include: {
        order: { select: { orderNumber: true, type: true, createdAt: true } },
        modifiers: true,
        variants: true
      },
      orderBy: { order: { createdAt: 'asc' } }
    });
  }

  async markItemReady(tenantId: string, orderItemId: string) {
    const item = await this.prisma.orderItem.update({
      where: { id: orderItemId }, // Should strictly verify tenant access via order
      data: { kitchenStatus: 'READY' },
      include: { order: { include: { items: true } } }
    });

    // Check if ALL items in order are ready
    const order = item.order;
    const allReady = order.items.every(i => i.kitchenStatus === 'READY' || i.kitchenStatus === 'CANCELLED');

    if (allReady) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'READY' }
      });
      
      // Log timeline event
      await this.prisma.orderTimeline.create({
        data: {
          orderId: order.id,
          status: 'READY',
          actor: 'System (KDS)',
          notes: 'All items marked ready'
        }
      });
    }

    return item;
  }
}
