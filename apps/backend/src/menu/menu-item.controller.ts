import { Controller, Get, Post, Put, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Menu Items')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('categories/:categoryId/items')
export class MenuItemController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getItems(@Param('categoryId') categoryId: string) {
    return { success: true, data: await this.menuService.getItems(categoryId) };
  }

  @Post()
  async createItem(@Param('categoryId') categoryId: string, @Body() data: any) {
    return { success: true, data: await this.menuService.createItem(categoryId, data) };
  }

  @Put(':itemId')
  async updateItem(@Param('itemId') itemId: string, @Body() data: any) {
    return { success: true, data: await this.menuService.updateItem(itemId, data) };
  }

  @Post(':itemId/variants')
  async addVariant(@Param('itemId') itemId: string, @Body() data: any) {
    return { success: true, data: await this.menuService.addVariant(itemId, data) };
  }
}
