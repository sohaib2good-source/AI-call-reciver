import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI Settings')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('ai/settings')
export class AiSettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getSettings(@Req() req: TenantRequest) {
    let settings = await this.prisma.aiSettings.findUnique({
      where: { tenantId: req.tenantId! }
    });

    if (!settings) {
      settings = await this.prisma.aiSettings.create({
        data: { tenantId: req.tenantId! }
      });
    }

    return { success: true, data: settings };
  }

  @Put()
  async updateSettings(@Req() req: TenantRequest, @Body() data: any) {
    const settings = await this.prisma.aiSettings.update({
      where: { tenantId: req.tenantId! },
      data
    });
    return { success: true, data: settings };
  }
}
