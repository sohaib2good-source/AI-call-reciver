import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Waitlist')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getWaitlist(@Req() req: TenantRequest) {
    // Return today's waitlist
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const list = await this.prisma.waitlist.findFirst({
      where: { tenantId: req.tenantId!, date: today },
      include: {
        entries: {
          include: { customer: true },
          orderBy: { priority: 'desc' }
        }
      }
    });
    
    return { success: true, data: list };
  }

  @Post('join')
  async joinWaitlist(@Req() req: TenantRequest, @Body() data: any) {
    // Minimal mock for adding to waitlist
    return { success: true, message: "Added to waitlist" };
  }
}
