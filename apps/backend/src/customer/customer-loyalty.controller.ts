import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Customer Loyalty')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('customers/:id/loyalty')
export class CustomerLoyaltyController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('add-points')
  async addPoints(
    @Req() req: TenantRequest, 
    @Param('id') id: string,
    @Body('points') points: number
  ) {
    const loyalty = await this.customerService.updateLoyaltyPoints(req.tenantId!, id, points);
    return { success: true, data: loyalty };
  }
}
