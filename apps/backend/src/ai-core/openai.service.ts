import { Injectable, Logger } from '@nestjs/common';
import { PromptEngine } from './prompt.engine';
import { MemoryManager } from './memory.manager';
import { ToolRegistry } from './tool.registry';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(
    private promptEngine: PromptEngine,
    private memoryManager: MemoryManager,
    private toolRegistry: ToolRegistry
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processMessage(tenantId: string, sessionId: string, userMessage: string) {
    const start = Date.now();
    
    await this.memoryManager.appendMessage(sessionId, 'user', userMessage);

    const systemPrompt = await this.promptEngine.compileSystemPrompt(tenantId);
    const history = await this.memoryManager.getRecentHistory(sessionId);

    this.logger.log(`Calling OpenAI for session ${sessionId}...`);
    
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
      });

      const responseMessage = completion.choices[0].message?.content || "Sorry, I couldn't process that.";
      
      await this.memoryManager.appendMessage(sessionId, 'assistant', responseMessage, Date.now() - start);

      return {
        message: responseMessage,
        status: 'success'
      };
    } catch (error) {
      this.logger.error('OpenAI Error:', error);
      return {
        message: "I'm having trouble thinking right now. Please try again later.",
        status: 'error'
      };
    }
  }
}
