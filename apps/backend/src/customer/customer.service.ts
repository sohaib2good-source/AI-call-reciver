import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineEventType, LoyaltyTier } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  // ==========================
  // CUSTOMER PROFILE
  // ==========================
  async getCustomers(tenantId: string, query: string, isVip?: boolean) {
    const where: any = { tenantId };
    
    if (query) {
      where.OR = [
        { primaryPhone: { contains: query } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    if (isVip !== undefined) {
      where.isVip = isVip;
    }

    return this.prisma.customer.findMany({
      where,
      include: { loyalty: true },
      orderBy: { lastVisit: 'desc' },
      take: 50 // Simplified pagination for prototype
    });
  }

  async getCustomerById(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        preferences: true,
        dietary: true,
        loyalty: true,
      }
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async createCustomer(tenantId: string, data: any) {
    // Automatically create empty related records
    return this.prisma.customer.create({
      data: {
        ...data,
        tenantId,
        preferences: { create: {} },
        dietary: { create: {} },
        loyalty: { create: {} }
      }
    });
  }

  async updateCustomer(tenantId: string, id: string, data: any) {
    return this.prisma.customer.update({
      where: { id_tenantId: { id, tenantId } } as any, // Simple workaround, realistically need exact where
      data
    });
  }

  // ==========================
  // TIMELINE
  // ==========================
  async getTimeline(tenantId: string, customerId: string) {
    return this.prisma.customerTimeline.findMany({
      where: { customerId, customer: { tenantId } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addTimelineEvent(tenantId: string, customerId: string, type: TimelineEventType, title: string, metadata?: any) {
    return this.prisma.customerTimeline.create({
      data: {
        type,
        title,
        metadata,
        customerId
      }
    });
  }

  // ==========================
  // LOYALTY
  // ==========================
  async updateLoyaltyPoints(tenantId: string, customerId: string, pointsToAdd: number) {
    const loyalty = await this.prisma.customerLoyalty.findUnique({ where: { customerId } });
    if (!loyalty) throw new NotFoundException('Loyalty not found');

    const newPoints = loyalty.points + pointsToAdd;
    let newTier = loyalty.membershipLevel;

    // Stub logic for tier upgrades
    if (newPoints > 1000) newTier = LoyaltyTier.DIAMOND;
    else if (newPoints > 500) newTier = LoyaltyTier.PLATINUM;
    else if (newPoints > 200) newTier = LoyaltyTier.GOLD;
    else if (newPoints > 50) newTier = LoyaltyTier.SILVER;

    return this.prisma.customerLoyalty.update({
      where: { customerId },
      data: {
        points: newPoints,
        lifetimePoints: loyalty.lifetimePoints + Math.max(0, pointsToAdd),
        membershipLevel: newTier
      }
    });
  }

  // ==========================
  // AI SPECIFIC
  // ==========================
  async getAiContextByPhone(tenantId: string, phone: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { tenantId, primaryPhone: phone },
      include: { preferences: true, dietary: true, loyalty: true, timeline: { take: 5, orderBy: { createdAt: 'desc' } } }
    });

    if (!customer) return null;

    // Map to optimized token-friendly response
    return {
      customer: {
        firstName: customer.firstName,
        isVip: customer.isVip,
        loyaltyTier: customer.loyalty?.membershipLevel
      },
      preferences: {
        favoriteItems: customer.preferences?.favoriteMenuItems || [],
        favoriteDrinks: customer.preferences?.favoriteDrinks || []
      },
      dietary: {
        isVegan: customer.dietary?.isVegan || false,
        allergies: customer.dietary?.customAllergies || []
      },
      recentInteractions: {
        lastOrderDate: customer.lastOrder,
        lastComplaint: customer.timeline.find(t => t.type === 'COMPLAINT')?.title
      }
    };
  }
}
