import { Controller, Get, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tables & Areas')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  async getAreas(@Req() req: TenantRequest) {
    const data = await this.tablesService.getAreasAndTables(req.tenantId!);
    return { success: true, data };
  }

  @Post('areas')
  async createArea(@Req() req: TenantRequest, @Body() data: any) {
    const created = await this.tablesService.createArea(req.tenantId!, data);
    return { success: true, data: created };
  }

  @Post('areas/:areaId/tables')
  async createTable(
    @Req() req: TenantRequest, 
    @Param('areaId') areaId: string, 
    @Body() data: any
  ) {
    const created = await this.tablesService.createTable(req.tenantId!, areaId, data);
    return { success: true, data: created };
  }
}
