import { Injectable } from '@nestjs/common';
import { VoiceProviderInterface } from './voice-provider.interface';

@Injectable()
export class TwilioProvider implements VoiceProviderInterface {
  
  generateConnectStreamResponse(tenantId: string, callSid: string, streamUrl: string) {
    // Generate valid TwiML to open a bidirectional media stream
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}">
      <Parameter name="tenantId" value="${tenantId}" />
      <Parameter name="callSid" value="${callSid}" />
    </Stream>
  </Connect>
</Response>`;
  }

  generateTransferResponse(transferNumber: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please wait while we connect you to a staff member.</Say>
  <Dial>${transferNumber}</Dial>
</Response>`;
  }

  generateHangupResponse() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Goodbye.</Say>
  <Hangup/>
</Response>`;
  }
}
