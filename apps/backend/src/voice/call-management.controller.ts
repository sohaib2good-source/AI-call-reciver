import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Call Management API')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('voice/calls')
export class CallManagementController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getCallHistory(@Req() req: TenantRequest) {
    const data = await this.prisma.callRecord.findMany({
      where: { tenantId: req.tenantId! },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return { success: true, data };
  }

  @Get('numbers')
  async getNumbers(@Req() req: TenantRequest) {
    const data = await this.prisma.phoneNumber.findMany({
      where: { tenantId: req.tenantId! }
    });
    return { success: true, data };
  }
}
