import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('invite')
  @UseGuards(AuthGuard('firebase-auth'), RolesGuard)
  @Roles(Role.OWNER, Role.MANAGER)
  async inviteUser(
    @Request() req: any,
    @Body() body: { email: string; role: Role }
  ) {
    // Only Owners and Managers can invite users
    return this.invitationService.inviteUser(req.user.tenantId, body.email, body.role);
  }

  @Post('accept')
  async acceptInvitation(
    @Body() body: { token: string; firebaseUid: string }
  ) {
    return this.invitationService.acceptInvitation(body.token, body.firebaseUid);
  }
}
