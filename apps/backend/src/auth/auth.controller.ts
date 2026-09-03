import { Controller, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Req() req: any) {
    const { email, password } = body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(email, password, ipAddress, userAgent);
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) throw new UnauthorizedException();
    await this.authService.logout(body.refreshToken);
    return { success: true };
  }
}
