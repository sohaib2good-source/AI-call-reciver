import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ReservationService } from './reservation.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Reservation API')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('ai/reservations')
export class ReservationAiController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly reservationService: ReservationService
  ) {}

  @Get('availability')
  @ApiOperation({ summary: 'AI checks available slots without touching DB directly' })
  async checkAvailability(
    @Req() req: TenantRequest, 
    @Query('date') date: string, 
    @Query('guests') guests: number
  ) {
    const slots = await this.availabilityService.checkAvailability(req.tenantId!, new Date(date), Number(guests));
    return { success: true, data: slots };
  }

  @Post('book')
  @ApiOperation({ summary: 'AI creates a reservation on behalf of the user' })
  async bookReservation(@Req() req: TenantRequest, @Body() data: any) {
    // Hardcode source as AI_RECEPTIONIST
    data.source = 'AI_RECEPTIONIST';
    data.createdBy = 'AI_AGENT';
    
    const reservation = await this.reservationService.createReservation(req.tenantId!, data);
    return { success: true, data: reservation };
  }
}
