import { Controller, Get, Post, Put, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Customers (CRM)')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getCustomers(
    @Req() req: TenantRequest,
    @Query('q') q: string,
    @Query('vip') vip: string
  ) {
    const isVip = vip === 'true' ? true : undefined;
    const data = await this.customerService.getCustomers(req.tenantId!, q, isVip);
    return { success: true, data };
  }

  @Post()
  async createCustomer(@Req() req: TenantRequest, @Body() data: any) {
    const created = await this.customerService.createCustomer(req.tenantId!, data);
    return { success: true, data: created };
  }

  @Get(':id')
  async getCustomerById(@Req() req: TenantRequest, @Param('id') id: string) {
    const data = await this.customerService.getCustomerById(req.tenantId!, id);
    return { success: true, data };
  }

  @Put(':id')
  async updateCustomer(@Req() req: TenantRequest, @Param('id') id: string, @Body() data: any) {
    const updated = await this.customerService.updateCustomer(req.tenantId!, id, data);
    return { success: true, data: updated };
  }
}
