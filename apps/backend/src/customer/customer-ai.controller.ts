import { Controller, Get, Query, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI CRM Context API')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('ai/customers')
export class CustomerAiController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('lookup')
  @ApiOperation({ summary: 'Lookup customer context by phone for AI Receptionist' })
  async getContextByPhone(@Req() req: TenantRequest, @Query('phone') phone: string) {
    if (!phone) throw new NotFoundException('Phone required');
    
    // AI MUST NOT read DB directly. Fetches limited context.
    const context = await this.customerService.getAiContextByPhone(req.tenantId!, phone);
    
    if (!context) {
      return { success: true, data: null, message: "New Customer" };
    }
    
    return { success: true, data: context };
  }
}
