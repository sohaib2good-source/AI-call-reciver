import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeProvider } from './stripe.provider';
import { SubscriptionPlan } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private stripeProvider: StripeProvider
  ) {}

  async initializeTrial(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error("Tenant not found");

    const customerId = await this.stripeProvider.createCustomer(tenant.email || '', tenant.name, tenantId);
    
    // Create Free Trial locally
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14 day trial

    return this.prisma.subscription.create({
      data: {
        tenantId,
        plan: 'FREE_TRIAL',
        status: 'TRIALING',
        stripeCustomerId: customerId,
        currentPeriodEnd: endDate
      }
    });
  }

  async changePlan(tenantId: string, newPlan: SubscriptionPlan, priceId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (!sub || !sub.stripeCustomerId) throw new Error("No existing customer found");

    const stripeSub = await this.stripeProvider.createSubscription(sub.stripeCustomerId, priceId);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        plan: newPlan,
        status: 'ACTIVE',
        stripeSubscriptionId: stripeSub.id,
        currentPeriodEnd: endDate
      }
    });
  }
}
