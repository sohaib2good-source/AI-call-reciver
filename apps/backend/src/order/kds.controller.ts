import { Controller, Get, Post, Param, Query, Req, UseGuards } from '@nestjs/common';
import { KdsService } from './kds.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Kitchen Display System (KDS)')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('kds')
export class KdsController {
  constructor(private readonly kdsService: KdsService) {}

  @Get('queue')
  async getQueue(@Req() req: TenantRequest, @Query('stationId') stationId: string) {
    const data = await this.kdsService.getStationQueue(req.tenantId!, stationId);
    return { success: true, data };
  }

  @Post('items/:itemId/ready')
  async markItemReady(@Req() req: TenantRequest, @Param('itemId') itemId: string) {
    const data = await this.kdsService.markItemReady(req.tenantId!, itemId);
    return { success: true, data };
  }
}
