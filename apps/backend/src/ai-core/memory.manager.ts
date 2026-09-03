import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemoryManager {
  constructor(private prisma: PrismaService) {}

  async initializeSession(tenantId: string, sessionId: string, channel: string, customerId?: string) {
    return this.prisma.conversationSession.create({
      data: {
        sessionId,
        tenantId,
        channel,
        customerId,
        status: 'ACTIVE'
      }
    });
  }

  async appendMessage(sessionId: string, role: string, content: string, latencyMs: number = 0, toolData?: any) {
    const session = await this.prisma.conversationSession.findUnique({ where: { sessionId } });
    if (!session) throw new Error("Session not found");

    return this.prisma.conversationLog.create({
      data: {
        sessionId: session.id,
        role,
        content,
        latencyMs,
        toolCallId: toolData?.toolCallId,
        toolName: toolData?.toolName,
        toolArgs: toolData?.toolArgs ? JSON.parse(JSON.stringify(toolData.toolArgs)) : null
      }
    });
  }

  async getRecentHistory(sessionId: string, limit: number = 20) {
    const session = await this.prisma.conversationSession.findUnique({ 
      where: { sessionId },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
          take: limit
        }
      }
    });
    
    if (!session) return [];
    
    // Return chronological order
    return session.logs.reverse().map(log => ({
      role: log.role,
      content: log.content,
      tool_call_id: log.toolCallId,
      name: log.toolName
    }));
  }
}
