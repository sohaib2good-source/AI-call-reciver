import { Controller, Post, Body, Headers, Res } from '@nestjs/common';
import { CallService } from './call.service';
import { TwilioProvider } from './twilio.provider';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Voice Webhooks')
@Controller('webhook/voice')
export class VoiceWebhookController {
  constructor(
    private readonly callService: CallService,
    private readonly twilioProvider: TwilioProvider
  ) {}

  @Post('twilio/incoming')
  @ApiOperation({ summary: 'Handles incoming calls from Twilio' })
  async handleIncomingTwilio(
    @Body() body: any,
    @Res() res: Response
  ) {
    // In production, validate Twilio X-Twilio-Signature header here
    const { CallSid, From, To } = body;
    
    // Hardcoded tenant mapping for MVP (normally parsed from 'To' number via DB)
    const tenantId = "DEMO-TENANT-ID"; 
    
    try {
      await this.callService.handleIncomingCall(tenantId, CallSid, From, To);
      
      // Tell Twilio to open a WebSocket stream to our AI Server
      const wssUrl = `wss://${process.env.APP_DOMAIN}/streams/ai`;
      const twiml = this.twilioProvider.generateConnectStreamResponse(tenantId, CallSid, wssUrl);
      
      res.set('Content-Type', 'text/xml');
      return res.send(twiml);
    } catch (e) {
      // Fallback
      res.set('Content-Type', 'text/xml');
      return res.send(this.twilioProvider.generateHangupResponse());
    }
  }

  @Post('twilio/status')
  @ApiOperation({ summary: 'Handles Twilio Call Status changes (Completed, Failed)' })
  async handleTwilioStatus(@Body() body: any, @Res() res: Response) {
    const { CallSid, CallStatus, CallDuration, RecordingUrl } = body;
    
    let internalStatus = 'COMPLETED';
    if (CallStatus === 'failed') internalStatus = 'FAILED';
    if (CallStatus === 'no-answer') internalStatus = 'NO_ANSWER';

    await this.callService.updateCallStatus(
      CallSid, 
      internalStatus, 
      parseInt(CallDuration || '0', 10), 
      RecordingUrl
    );

    return res.status(200).send();
  }
}
