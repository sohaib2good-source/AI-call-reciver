import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tables & Floor Plan')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('tables')
export class TableController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('floor-plan')
  async getFloorPlan(@Req() req: TenantRequest) {
    const floors = await this.prisma.restaurantFloor.findMany({
      where: { tenantId: req.tenantId! },
      include: {
        areas: {
          include: {
            tables: true
          }
        }
      }
    });
    return { success: true, data: floors };
  }

  @Post()
  async createTable(@Req() req: TenantRequest, @Body() data: any) {
    const table = await this.prisma.table.create({
      data: { ...data }
    });
    return { success: true, data: table };
  }
}
