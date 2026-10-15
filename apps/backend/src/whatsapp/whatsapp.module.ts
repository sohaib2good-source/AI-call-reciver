import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { AiCoreModule } from '../ai-core/ai-core.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AiCoreModule, PrismaModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
