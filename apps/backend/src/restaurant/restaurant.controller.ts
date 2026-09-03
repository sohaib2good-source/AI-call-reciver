import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Restaurant Profile')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('profile')
  async getProfile(@Req() req: TenantRequest) {
    const data = await this.restaurantService.getProfile(req.tenantId!);
    return { success: true, data };
  }

  @Put('profile')
  async updateProfile(@Req() req: TenantRequest, @Body() data: any) {
    const updated = await this.restaurantService.updateProfile(req.tenantId!, data);
    return { success: true, data: updated };
  }
}
