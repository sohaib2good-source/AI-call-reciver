import { Module } from '@nestjs/common';
import { DeliveryPickupController } from './delivery-pickup.controller';
import { DeliveryPickupService } from './delivery-pickup.service';

@Module({
  controllers: [DeliveryPickupController],
  providers: [DeliveryPickupService],
})
export class DeliveryPickupModule {}
