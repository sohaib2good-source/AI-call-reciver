import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { KdsService } from './kds.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { KdsController } from './kds.controller';
import { OrderAiController } from './order-ai.controller';

@Module({
  controllers: [
    OrderController,
    KdsController,
    OrderAiController
  ],
  providers: [
    PricingService,
    KdsService,
    OrderService
  ],
})
export class OrderModule {}
