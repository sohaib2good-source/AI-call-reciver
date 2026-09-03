import { Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class OnboardingService {
  async completeOnboarding(data: {
    restaurantName: string;
    currency: string;
    timezone: string;
    ownerName: string;
    ownerEmail: string;
    firebaseUid: string;
  }) {
    // Scaffold entire Tenant and Owner inside a transaction
    const tenant = await prisma.tenant.create({
      data: {
        name: data.restaurantName,
        currency: data.currency,
        timezone: data.timezone,
        users: {
          create: {
            email: data.ownerEmail,
            firstName: data.ownerName,
            role: Role.OWNER,
            firebaseUid: data.firebaseUid,
          },
        },
        businessHours: {
          create: [
            { type: 'NORMAL', dayOfWeek: 1, openTime: '09:00', closeTime: '22:00', isClosed: false },
            { type: 'NORMAL', dayOfWeek: 2, openTime: '09:00', closeTime: '22:00', isClosed: false },
            { type: 'NORMAL', dayOfWeek: 3, openTime: '09:00', closeTime: '22:00', isClosed: false },
            { type: 'NORMAL', dayOfWeek: 4, openTime: '09:00', closeTime: '22:00', isClosed: false },
            { type: 'NORMAL', dayOfWeek: 5, openTime: '09:00', closeTime: '23:00', isClosed: false },
            { type: 'NORMAL', dayOfWeek: 6, openTime: '10:00', closeTime: '23:00', isClosed: false },
            { type: 'NORMAL', dayOfWeek: 0, openTime: '10:00', closeTime: '21:00', isClosed: false },
          ]
        },
        subscription: {
          create: {
            plan: 'TRIAL',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          }
        }
      },
      include: { users: true },
    });

    return tenant;
  }
}
