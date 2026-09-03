import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { MemoryManager } from './memory.manager';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Interaction Gateway')
@Controller('webhook/ai')
export class AiInteractionController {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly memoryManager: MemoryManager
  ) {}

  @Post(':tenantId/start')
  @ApiOperation({ summary: 'Initialize a new AI conversation session (Voice or Web)' })
  async startSession(@Param('tenantId') tenantId: string, @Body() data: any) {
    const session = await this.memoryManager.initializeSession(tenantId, data.sessionId, data.channel || 'VOICE', data.customerId);
    return { success: true, sessionId: session.sessionId };
  }

  @Post(':tenantId/message')
  @ApiOperation({ summary: 'Process an incoming message/transcript segment' })
  async processMessage(@Param('tenantId') tenantId: string, @Body() data: any) {
    const response = await this.openAiService.processMessage(tenantId, data.sessionId, data.message);
    return response;
  }
}
