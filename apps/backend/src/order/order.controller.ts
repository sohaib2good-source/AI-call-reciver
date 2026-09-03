import { Controller, Get, Post, Put, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(@Req() req: TenantRequest, @Query('status') status: string) {
    const data = await this.orderService.getOrders(req.tenantId!, status);
    return { success: true, data };
  }

  @Post()
  async createOrder(@Req() req: TenantRequest, @Body() data: any) {
    const created = await this.orderService.createOrder(req.tenantId!, data);
    return { success: true, data: created };
  }

  @Get(':id')
  async getOrderById(@Req() req: TenantRequest, @Param('id') id: string) {
    const data = await this.orderService.getOrderById(req.tenantId!, id);
    return { success: true, data };
  }
}
