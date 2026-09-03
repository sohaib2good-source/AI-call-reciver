import { Module } from '@nestjs/common';
import { StripeProvider } from './stripe.provider';
import { SubscriptionService } from './subscription.service';
import { UsageService } from './usage.service';
import { BillingController } from './billing.controller';
import { BillingWebhookController } from './webhook.controller';

@Module({
  controllers: [
    BillingController,
    BillingWebhookController
  ],
  providers: [
    StripeProvider,
    SubscriptionService,
    UsageService
  ],
})
export class BillingModule {}
