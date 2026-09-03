import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimelineEventType } from '@prisma/client';

@ApiTags('Customer Timeline')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('customers/:id/timeline')
export class CustomerTimelineController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getTimeline(@Req() req: TenantRequest, @Param('id') id: string) {
    const data = await this.customerService.getTimeline(req.tenantId!, id);
    return { success: true, data };
  }

  @Post()
  async addEvent(
    @Req() req: TenantRequest, 
    @Param('id') id: string,
    @Body() body: { type: TimelineEventType, title: string, metadata?: any }
  ) {
    const event = await this.customerService.addTimelineEvent(req.tenantId!, id, body.type, body.title, body.metadata);
    return { success: true, data: event };
  }
}
