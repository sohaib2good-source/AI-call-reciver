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

  async getAgentProfileContext(tenantId: string) {
    const tenant = await this.getProfile(tenantId);
    const aiSettings = await this.prisma.aiSettings.findUnique({
      where: { tenantId },
    });

    const businessName = tenant?.businessName || tenant?.name || 'AI Restaurant';
    const industry = tenant?.cuisineType || 'Restaurant, Cafe & Food Service';
    const roleTitle = 'Front-Desk Receptionist';

    return {
      business_profile: {
        display_name: businessName,
        legal_name: tenant?.legalName || businessName,
        industry: tenant?.cuisineType || 'general_business',
        description: tenant?.description || 'AI-assisted business and reception desk.',
        contact: {
          phone: tenant?.phoneNumbers?.[0] || '+1 (555) 019-2834',
          email: tenant?.email || 'contact@business.com',
          website: tenant?.website || null,
        },
        location: tenant?.address
          ? {
              street: tenant.address.street,
              city: tenant.address.city,
              state: tenant.address.state,
              postal_code: tenant.address.postalCode,
              country: tenant.address.country,
            }
          : null,
      },
      ai_agent_identity: {
        role: 'receptionist',
        title: roleTitle,
        typical_tasks: [
          'Call Screening',
          'FAQs',
          'Routing',
          'Hours & Location',
          'Booking Inquiries',
        ],
        caller_greeting:
          aiSettings?.greeting ||
          `Thank you for calling ${businessName}. This is your AI ${roleTitle}. How may I assist you today?`,
      },
      telephony_prompt_context: {
        system_instructions: `You are the AI ${roleTitle} for ${businessName} (${industry}). Answer caller questions accurately, be polite, and take messages or book appointments according to business hours.`,
      },
    };
  }
}
