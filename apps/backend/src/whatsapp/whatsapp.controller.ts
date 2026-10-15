import { Controller, Get, Post, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './whatsapp.service';

@Controller('webhook/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  // Webhook Verification (Meta sends a GET request to verify)
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifyToken =
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'my_super_secret_verify_token_123';

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('[Meta Webhook] Successfully verified webhook with challenge');
        return res.status(HttpStatus.OK).send(challenge);
      } else {
        return res.sendStatus(HttpStatus.FORBIDDEN);
      }
    }
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  // Handle incoming calls and messages from Meta
  @Post()
  async handleIncomingMessage(@Body() body: any, @Res() res: Response) {
    // WhatsApp requires an immediate 200 OK response
    res.sendStatus(HttpStatus.OK);

    await this.whatsappService.processMessage(body);
  }

  // Status and connectivity check
  @Get('status')
  async getStatus(@Res() res: Response) {
    const configured = Boolean(
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
    );

    return res.status(HttpStatus.OK).json({
      status: configured ? 'connected' : 'unconfigured',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || null,
      wabaId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || null,
      webhookVerified: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Interactive Call Simulation
  @Post('simulate-call')
  async simulateCall(@Body() body: any, @Res() res: Response) {
    const from = body.callerNumber || '+1 (555) 321-9876';
    const fakeCall = {
      id: `call_sim_${Date.now()}`,
      from,
      event: 'incoming',
      timestamp: Math.floor(Date.now() / 1000).toString(),
    };

    await this.whatsappService.handleIncomingCall(fakeCall, process.env.WHATSAPP_PHONE_NUMBER_ID);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Simulated incoming WhatsApp call picked up by AI Receptionist',
      callerNumber: from,
    });
  }
}
