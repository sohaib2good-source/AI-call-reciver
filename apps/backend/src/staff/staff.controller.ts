import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Staff & Employees')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async getStaff(@Req() req: TenantRequest) {
    const data = await this.staffService.getStaff(req.tenantId!);
    return { success: true, data };
  }

  @Post('invite')
  async inviteStaff(@Req() req: TenantRequest, @Body() data: { email: string; role: Role }) {
    const created = await this.staffService.inviteStaff(req.tenantId!, data.email, data.role);
    return { success: true, data: created };
  }
}
