import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async handleIncomingCall(tenantId: string, callSid: string, fromNumber: string, toNumber: string) {
    // Check if phone number belongs to tenant
    const phone = await this.prisma.phoneNumber.findFirst({
      where: { number: toNumber, tenantId }
    });

    if (!phone) {
      throw new Error("Invalid phone number mapping");
    }

    // Create a call record
    return this.prisma.callRecord.create({
      data: {
        tenantId,
        callSid,
        fromNumber,
        toNumber,
        direction: 'INBOUND',
        status: 'IN_PROGRESS'
      }
    });
  }

  async updateCallStatus(callSid: string, status: any, durationSeconds: number, recordingUrl?: string) {
    return this.prisma.callRecord.update({
      where: { callSid },
      data: {
        status,
        durationSeconds,
        recordingUrl
      }
    });
  }
}
