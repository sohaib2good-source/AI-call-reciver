import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from './subscription.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Billing & Subscription')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('billing')
export class BillingController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Get('subscription')
  async getSubscription(@Req() req: TenantRequest) {
    const sub = await this.prisma.subscription.findUnique({
      where: { tenantId: req.tenantId! }
    });
    return { success: true, data: sub };
  }

  @Get('invoices')
  async getInvoices(@Req() req: TenantRequest) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId: req.tenantId! },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: invoices };
  }

  @Post('change-plan')
  async changePlan(@Req() req: TenantRequest, @Body() body: any) {
    const { plan, priceId } = body;
    const sub = await this.subscriptionService.changePlan(req.tenantId!, plan, priceId);
    return { success: true, data: sub };
  }
}
