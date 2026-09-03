import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async calculateOrderTotals(tenantId: string, payload: any) {
    let subtotal = 0;

    // 1. Calculate items
    for (const item of payload.items) {
      const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) throw new NotFoundException(`Item ${item.menuItemId} not found`);

      let unitPrice = menuItem.price;

      // Handle variants
      if (item.variantId) {
        const variant = await this.prisma.itemVariant.findUnique({ where: { id: item.variantId } });
        if (variant) unitPrice = variant.price; // Usually overrides base price
      }

      // Handle modifiers
      if (item.modifierIds && item.modifierIds.length > 0) {
        const modifiers = await this.prisma.modifier.findMany({
          where: { id: { in: item.modifierIds } }
        });
        const modifierTotal = modifiers.reduce((acc, mod) => acc + mod.price, 0);
        unitPrice += modifierTotal;
      }

      subtotal += (unitPrice * item.quantity);
    }

    // 2. Fetch taxes & fees (From Tenant settings)
    const tenant = await this.prisma.tenant.findUnique({ 
      where: { id: tenantId },
      select: { taxSettings: true, serviceCharge: true }
    });

    const taxRate = tenant?.taxSettings ? (tenant.taxSettings as any).rate || 0.1 : 0.1; // fallback 10%
    const taxTotal = subtotal * taxRate;
    const serviceCharge = tenant?.serviceCharge || 0;
    
    // 3. Delivery fees
    let deliveryFee = 0;
    if (payload.type === 'DELIVERY') {
      const delSettings = await this.prisma.deliverySettings.findUnique({ where: { tenantId } });
      deliveryFee = delSettings?.deliveryFees ? (delSettings.deliveryFees as any).baseFee || 5.00 : 5.00;
    }

    // 4. Discounts
    let discountTotal = 0;
    if (payload.discountCode) {
      // Mock discount logic
      if (payload.discountCode === '10OFF') discountTotal = subtotal * 0.1;
    }

    const grandTotal = subtotal + taxTotal + serviceCharge + deliveryFee - discountTotal;

    return {
      subtotal,
      taxTotal,
      serviceCharge,
      deliveryFee,
      discountTotal,
      grandTotal
    };
  }
}
