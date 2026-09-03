import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Modifiers & Add-ons')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('modifiers')
export class ModifierController {
  constructor(private readonly menuService: MenuService) {}

  @Get('groups')
  async getGroups(@Req() req: TenantRequest) {
    return { success: true, data: await this.menuService.getModifierGroups(req.tenantId!) };
  }

  @Post('groups')
  async createGroup(@Req() req: TenantRequest, @Body() data: any) {
    return { success: true, data: await this.menuService.createModifierGroup(req.tenantId!, data) };
  }

  @Post('groups/:groupId/modifiers')
  async addModifier(@Param('groupId') groupId: string, @Body() data: any) {
    return { success: true, data: await this.menuService.addModifier(groupId, data) };
  }

  @Get('addons')
  async getAddOns(@Req() req: TenantRequest) {
    return { success: true, data: await this.menuService.getAddOns(req.tenantId!) };
  }

  @Post('addons')
  async createAddOn(@Req() req: TenantRequest, @Body() data: any) {
    return { success: true, data: await this.menuService.createAddOn(req.tenantId!, data) };
  }
}
