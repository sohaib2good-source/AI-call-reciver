import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { AiSettingsService } from './ai-settings.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI Settings')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('ai-settings')
export class AiSettingsController {
  constructor(private readonly service: AiSettingsService) {}

  @Get()
  async getSettings(@Req() req: TenantRequest) {
    const data = await this.service.getSettings(req.tenantId!);
    return { success: true, data };
  }

  @Get('agent-config')
  async getAgentConfig(@Req() req: TenantRequest) {
    const data = await this.service.getAgentConfig(req.tenantId!);
    return { success: true, data };
  }

  @Put()
  async updateSettings(@Req() req: TenantRequest, @Body() data: any) {
    const updated = await this.service.updateSettings(req.tenantId!, data);
    return { success: true, data: updated };
  }
}
