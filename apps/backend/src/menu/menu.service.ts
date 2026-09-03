import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // ==================
  // MENUS
  // ==================
  async getMenus(tenantId: string) {
    return this.prisma.menu.findMany({ where: { tenantId }, include: { categories: true } });
  }

  async createMenu(tenantId: string, data: any) {
    return this.prisma.menu.create({ data: { ...data, tenantId } });
  }

  // ==================
  // CATEGORIES
  // ==================
  async getCategories(menuId: string) {
    return this.prisma.category.findMany({ 
      where: { menuId },
      include: { subCategories: true }
    });
  }

  async createCategory(menuId: string, data: any) {
    return this.prisma.category.create({ data: { ...data, menuId } });
  }

  // ==================
  // MENU ITEMS
  // ==================
  async getItems(categoryId: string) {
    return this.prisma.menuItem.findMany({ 
      where: { categoryId },
      include: { variants: true, modifierGroups: true, addOns: true }
    });
  }

  async createItem(categoryId: string, data: any) {
    return this.prisma.menuItem.create({ data: { ...data, categoryId } });
  }

  async updateItem(itemId: string, data: any) {
    return this.prisma.menuItem.update({ where: { id: itemId }, data });
  }

  // ==================
  // VARIANTS
  // ==================
  async addVariant(itemId: string, data: any) {
    return this.prisma.itemVariant.create({ data: { ...data, itemId } });
  }

  // ==================
  // MODIFIERS
  // ==================
  async getModifierGroups(tenantId: string) {
    return this.prisma.modifierGroup.findMany({
      where: { tenantId },
      include: { modifiers: true }
    });
  }

  async createModifierGroup(tenantId: string, data: any) {
    return this.prisma.modifierGroup.create({ data: { ...data, tenantId } });
  }

  async addModifier(groupId: string, data: any) {
    return this.prisma.modifier.create({ data: { ...data, modifierGroupId: groupId } });
  }

  // ==================
  // ADD-ONS & COMBOS
  // ==================
  async getAddOns(tenantId: string) {
    return this.prisma.addOn.findMany({ where: { tenantId } });
  }

  async createAddOn(tenantId: string, data: any) {
    return this.prisma.addOn.create({ data: { ...data, tenantId } });
  }

  async getCombos(tenantId: string) {
    return this.prisma.combo.findMany({ where: { tenantId }, include: { items: true } });
  }

  async createCombo(tenantId: string, data: any) {
    return this.prisma.combo.create({ data: { ...data, tenantId } });
  }

  // ==================
  // AI-SPECIFIC READS
  // ==================
  async searchItemsForAi(tenantId: string, query: string) {
    // This is a specialized endpoint that AI calls. It performs full-text search
    // and returns simplified JSON optimized for LLM context windows.
    const items = await this.prisma.menuItem.findMany({
      where: { 
        category: { menu: { tenantId } },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ingredients: { has: query } }
        ]
      },
      include: { variants: true }
    });
    
    return items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.shortDesc,
      price: item.price,
      availability: item.status,
      variants: item.variants.map(v => ({ name: v.name, price: v.price }))
    }));
  }
}
