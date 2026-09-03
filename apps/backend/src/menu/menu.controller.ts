import { Controller, Get, Post, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Menu & Categories')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus(@Req() req: TenantRequest) {
    return { success: true, data: await this.menuService.getMenus(req.tenantId!) };
  }

  @Post()
  async createMenu(@Req() req: TenantRequest, @Body() data: any) {
    return { success: true, data: await this.menuService.createMenu(req.tenantId!, data) };
  }

  @Get(':menuId/categories')
  async getCategories(@Param('menuId') menuId: string) {
    return { success: true, data: await this.menuService.getCategories(menuId) };
  }

  @Post(':menuId/categories')
  async createCategory(@Param('menuId') menuId: string, @Body() data: any) {
    return { success: true, data: await this.menuService.createCategory(menuId, data) };
  }
}
