import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MenuItemController } from './menu-item.controller';
import { ModifierController } from './modifier.controller';
import { ComboController } from './combo.controller';
import { MenuAiController } from './menu-ai.controller';
import { MenuBulkController } from './menu-bulk.controller';

@Module({
  controllers: [
    MenuController,
    MenuItemController,
    ModifierController,
    ComboController,
    MenuAiController,
    MenuBulkController,
  ],
  providers: [MenuService],
})
export class MenuModule {}
