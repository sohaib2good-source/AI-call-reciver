import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Business Hours')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('business-hours')
export class BusinessHoursController {
  constructor(private readonly hoursService: BusinessHoursService) {}

  @Get()
  async getHours(@Req() req: TenantRequest) {
    const data = await this.hoursService.getHours(req.tenantId!);
    return { success: true, data };
  }

  @Put()
  async updateHours(@Req() req: TenantRequest, @Body() data: any[]) {
    const updated = await this.hoursService.updateHours(req.tenantId!, data);
    return { success: true, data: updated };
  }
}
