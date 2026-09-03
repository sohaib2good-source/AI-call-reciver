import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsageMetric } from '@prisma/client';

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  async logUsage(tenantId: string, metric: UsageMetric, quantity: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.usageRecord.upsert({
      where: {
        tenantId_metric_date: {
          tenantId,
          metric,
          date: today
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        tenantId,
        metric,
        date: today,
        quantity
      }
    });
  }

  async getCurrentUsage(tenantId: string, startDate: Date, endDate: Date) {
    return this.prisma.usageRecord.findMany({
      where: {
        tenantId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
  }
}
