import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Billing Webhooks')
@Controller('webhook/billing')
export class BillingWebhookController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Handles Stripe Webhooks' })
  async handleStripeWebhook(@Body() event: any, @Res() res: Response) {
    // In production, construct the Stripe Event using the raw body and signature header

    switch (event.type) {
      case 'invoice.payment_succeeded':
        // Handle successful payment
        break;
      
      case 'invoice.payment_failed':
        // Suspend the tenant due to non-payment
        const customerId = event.data.object.customer;
        const sub = await this.prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId }
        });
        
        if (sub) {
          await this.prisma.tenant.update({
            where: { id: sub.tenantId },
            data: { status: 'PAST_DUE' }
          });
        }
        break;

      default:
        // Unhandled event type
        break;
    }

    return res.status(200).send({ received: true });
  }
}
