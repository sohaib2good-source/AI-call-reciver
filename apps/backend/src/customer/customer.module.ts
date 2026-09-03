import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerTimelineController } from './customer-timeline.controller';
import { CustomerLoyaltyController } from './customer-loyalty.controller';
import { CustomerAiController } from './customer-ai.controller';
import { CustomerBulkController } from './customer-bulk.controller';

@Module({
  controllers: [
    CustomerController,
    CustomerTimelineController,
    CustomerLoyaltyController,
    CustomerAiController,
    CustomerBulkController,
  ],
  providers: [CustomerService],
})
export class CustomerModule {}
