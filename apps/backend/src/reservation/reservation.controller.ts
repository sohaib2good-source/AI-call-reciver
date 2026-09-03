import { Controller, Get, Post, Put, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async getReservations(@Req() req: TenantRequest, @Query('date') date: string) {
    const data = await this.reservationService.getReservations(req.tenantId!, date);
    return { success: true, data };
  }

  @Post()
  async createReservation(@Req() req: TenantRequest, @Body() data: any) {
    const created = await this.reservationService.createReservation(req.tenantId!, data);
    return { success: true, data: created };
  }

  @Put(':id/status')
  async updateStatus(
    @Req() req: TenantRequest, 
    @Param('id') id: string, 
    @Body('status') status: ReservationStatus
  ) {
    const updated = await this.reservationService.updateReservationStatus(req.tenantId!, id, status);
    return { success: true, data: updated };
  }
}
