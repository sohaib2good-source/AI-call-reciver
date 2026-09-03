import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Combos & Deals')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('combos')
export class ComboController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getCombos(@Req() req: TenantRequest) {
    return { success: true, data: await this.menuService.getCombos(req.tenantId!) };
  }

  @Post()
  async createCombo(@Req() req: TenantRequest, @Body() data: any) {
    return { success: true, data: await this.menuService.createCombo(req.tenantId!, data) };
  }
}
