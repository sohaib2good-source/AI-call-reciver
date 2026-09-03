import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { OrderService } from './order.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Order API')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('ai/orders')
export class OrderAiController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly orderService: OrderService
  ) {}

  @Post('calculate')
  @ApiOperation({ summary: 'AI asks backend to safely compute total price (Tax/Fees)' })
  async calculateTotal(@Req() req: TenantRequest, @Body() data: any) {
    const totals = await this.pricingService.calculateOrderTotals(req.tenantId!, data);
    return { success: true, data: totals };
  }

  @Post('create')
  @ApiOperation({ summary: 'AI finalizes and places a phone order' })
  async bookOrder(@Req() req: TenantRequest, @Body() data: any) {
    data.source = 'AI_AGENT';
    data.type = 'AI_PHONE';
    
    const order = await this.orderService.createOrder(req.tenantId!, data);
    return { success: true, data: order };
  }
}
