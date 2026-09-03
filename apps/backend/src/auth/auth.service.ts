import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';

@Injectable()
export class AuthService {
  async login(email: string, passwordPlain: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked due to too many failed attempts. Try again later.');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash || '');
    if (!isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          loginAttempts: { increment: 1 },
          lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null 
        }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset attempts on success
    if (user.loginAttempts > 0) {
      await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lockedUntil: null } });
    }

    const accessToken = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = crypto.randomBytes(40).toString('hex');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress,
        userAgent,
      }
    });

    return { accessToken, refreshToken, user };
  }

  async logout(refreshToken: string) {
    await prisma.session.update({
      where: { refreshToken },
      data: { isRevoked: true }
    });
  }
}
