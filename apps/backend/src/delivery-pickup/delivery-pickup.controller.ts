import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { DeliveryPickupService } from './delivery-pickup.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Delivery & Pickup')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('delivery-pickup')
export class DeliveryPickupController {
  constructor(private readonly service: DeliveryPickupService) {}

  @Get('delivery')
  async getDeliverySettings(@Req() req: TenantRequest) {
    const data = await this.service.getDeliverySettings(req.tenantId!);
    return { success: true, data };
  }

  @Put('delivery')
  async updateDeliverySettings(@Req() req: TenantRequest, @Body() data: any) {
    const updated = await this.service.updateDeliverySettings(req.tenantId!, data);
    return { success: true, data: updated };
  }

  @Get('pickup')
  async getPickupSettings(@Req() req: TenantRequest) {
    const data = await this.service.getPickupSettings(req.tenantId!);
    return { success: true, data };
  }

  @Put('pickup')
  async updatePickupSettings(@Req() req: TenantRequest, @Body() data: any) {
    const updated = await this.service.updatePickupSettings(req.tenantId!, data);
    return { success: true, data: updated };
  }
}
