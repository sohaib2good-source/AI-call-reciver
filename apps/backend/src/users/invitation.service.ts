import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class InvitationService {
  async inviteUser(tenantId: string, email: string, role: Role) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return prisma.invitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        tenantId,
      },
    });
  }

  async acceptInvitation(token: string, firebaseUid: string) {
    const invite = await prisma.invitation.findUnique({ where: { token } });
    if (!invite) throw new BadRequestException('Invalid or expired invitation');
    if (invite.expiresAt < new Date()) throw new BadRequestException('Invitation expired');

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: invite.email,
        role: invite.role,
        firebaseUid,
        tenantId: invite.tenantId,
      },
    });

    // Delete the invitation
    await prisma.invitation.delete({ where: { id: invite.id } });

    return user;
  }
}
