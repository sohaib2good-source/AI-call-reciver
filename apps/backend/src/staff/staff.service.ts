import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async getStaff(tenantId: string) {
    return this.prisma.user.findMany({ where: { tenantId } });
  }

  async inviteStaff(tenantId: string, email: string, role: Role) {
    // In a real app, this would generate a Firebase Auth invitation link
    // and send an email. For now, we stub the DB creation.
    return this.prisma.user.create({
      data: {
        email,
        role,
        tenantId,
      },
    });
  }
}
