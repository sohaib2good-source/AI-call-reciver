import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from './pricing.service';
import { KdsService } from './kds.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
    private kdsService: KdsService
  ) {}

  async getOrders(tenantId: string, status?: any) {
    const where: any = { tenantId };
    if (status) where.status = status;

    return this.prisma.order.findMany({
      where,
      include: { items: true, customer: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(tenantId: string, id: string) {
    return this.prisma.order.findFirst({
      where: { id, tenantId },
      include: { items: { include: { modifiers: true, variants: true } }, customer: true, timeline: true }
    });
  }

  async createOrder(tenantId: string, payload: any) {
    // 1. Calculate precise totals (Never trust client pricing)
    const totals = await this.pricingService.calculateOrderTotals(tenantId, payload);

    // 2. Generate Order Number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // 3. Create Order & Items in Transaction
    // (A real implementation requires mapping MenuItem snapshot data to OrderItem)
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        type: payload.type || 'DINE_IN',
        status: 'PENDING',
        ...totals,
        tenantId,
        customerId: payload.customerId,
        tableId: payload.tableId,
        items: {
          create: payload.items.map(item => ({
            itemName: "Menu Item Placeholder", // Snapshot
            basePrice: 10.0, // Snapshot
            quantity: item.quantity,
            unitPrice: 10.0,
            totalPrice: 10.0 * item.quantity,
            kitchenStationId: item.kitchenStationId, // KDS routing
          }))
        },
        timeline: {
          create: {
            status: 'PENDING',
            actor: payload.source || 'System',
            notes: 'Order Created'
          }
        }
      },
      include: { items: true }
    });

    // 4. Route to Kitchen
    await this.kdsService.routeToStations(tenantId, order.id, order.items);

    return order;
  }

  async updateOrderStatus(tenantId: string, id: string, status: any) {
    return this.prisma.order.update({
      where: { id_tenantId: { id, tenantId } } as any, // Pseudo
      data: { status }
    });
  }
}
