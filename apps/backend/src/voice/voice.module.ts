import { Module } from '@nestjs/common';
import { TwilioProvider } from './twilio.provider';
import { CallService } from './call.service';
import { VoiceWebhookController } from './voice-webhook.controller';
import { CallManagementController } from './call-management.controller';

@Module({
  controllers: [
    VoiceWebhookController,
    CallManagementController
  ],
  providers: [
    TwilioProvider,
    CallService
  ],
})
export class VoiceModule {}
