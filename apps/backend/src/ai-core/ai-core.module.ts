import { Module } from '@nestjs/common';
import { ToolRegistry } from './tool.registry';
import { PromptEngine } from './prompt.engine';
import { UpsellEngine } from './upsell.engine';
import { MemoryManager } from './memory.manager';
import { OpenAIService } from './openai.service';
import { AiInteractionController } from './ai-interaction.controller';
import { AiSettingsController } from './ai-settings.controller';

@Module({
  controllers: [
    AiInteractionController,
    AiSettingsController
  ],
  providers: [
    ToolRegistry,
    PromptEngine,
    UpsellEngine,
    MemoryManager,
    OpenAIService
  ],
})
export class AiCoreModule {}
