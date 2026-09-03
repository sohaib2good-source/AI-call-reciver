import { Injectable, Logger } from '@nestjs/common';
import { PromptEngine } from './prompt.engine';
import { MemoryManager } from './memory.manager';
import { ToolRegistry } from './tool.registry';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);

  constructor(
    private promptEngine: PromptEngine,
    private memoryManager: MemoryManager,
    private toolRegistry: ToolRegistry
  ) {}

  // Simulates processing a message and interacting with OpenAI + Tools
  async processMessage(tenantId: string, sessionId: string, userMessage: string) {
    const start = Date.now();
    
    // 1. Log user message
    await this.memoryManager.appendMessage(sessionId, 'user', userMessage);

    // 2. Compile prompt and fetch history
    const systemPrompt = await this.promptEngine.compileSystemPrompt(tenantId);
    const history = await this.memoryManager.getRecentHistory(sessionId);
    const tools = this.toolRegistry.getAvailableTools();

    // 3. Mock OpenAI API call (In reality, call openai.chat.completions.create)
    this.logger.log(`Calling OpenAI for session ${sessionId}...`);
    
    // Mock response
    const mockResponse = "I can help you with that. Let me check the menu.";
    
    // 4. Log AI response
    await this.memoryManager.appendMessage(sessionId, 'assistant', mockResponse, Date.now() - start);

    return {
      message: mockResponse,
      status: 'success'
    };
  }
}
