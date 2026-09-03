import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('complete')
  @UseGuards(AuthGuard('firebase-auth'))
  async completeOnboarding(
    @Request() req,
    @Body() body: { restaurantName: string; currency: string; timezone: string; ownerName: string; }
  ) {
    const user = req.user; // populated by FirebaseStrategy
    
    return this.onboardingService.completeOnboarding({
      restaurantName: body.restaurantName,
      currency: body.currency,
      timezone: body.timezone,
      ownerName: body.ownerName,
      ownerEmail: user.email,
      firebaseUid: user.uid,
    });
  }
}
