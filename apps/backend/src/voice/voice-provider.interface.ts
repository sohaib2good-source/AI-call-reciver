export interface VoiceProviderInterface {
  /**
   * Generates the Initial response payload (TwiML for Twilio, JSON for Vapi)
   * to connect the caller to the AI WebSocket stream.
   */
  generateConnectStreamResponse(tenantId: string, callSid: string, streamUrl: string): any;

  /**
   * Generates payload to initiate a live transfer to a human
   */
  generateTransferResponse(transferNumber: string): any;

  /**
   * Drops the call
   */
  generateHangupResponse(): any;
}
