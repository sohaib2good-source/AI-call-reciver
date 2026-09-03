import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TableController } from './table.controller';
import { WaitlistController } from './waitlist.controller';
import { ReservationAiController } from './reservation-ai.controller';

@Module({
  controllers: [
    ReservationController,
    TableController,
    WaitlistController,
    ReservationAiController,
  ],
  providers: [
    ReservationService,
    AvailabilityService
  ],
})
export class ReservationModule {}
