import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';

import { RestaurantModule } from './restaurant/restaurant.module';
import { BusinessHoursModule } from './business-hours/business-hours.module';
import { TablesModule } from './tables/tables.module';
import { StaffModule } from './staff/staff.module';
import { DeliveryPickupModule } from './delivery-pickup/delivery-pickup.module';
import { AiSettingsModule } from './ai-settings/ai-settings.module';
import { MenuModule } from './menu/menu.module';
import { CustomerModule } from './customer/customer.module';
import { ReservationModule } from './reservation/reservation.module';
import { OrderModule } from './order/order.module';
import { AiCoreModule } from './ai-core/ai-core.module';
import { VoiceModule } from './voice/voice.module';
import { BillingModule } from './billing/billing.module';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env', '../.env'],
    }),
    PrismaModule,
    AuthModule,
    OnboardingModule,
    UsersModule,
    HealthModule,
    RestaurantModule,
    BusinessHoursModule,
    TablesModule,
    StaffModule,
    DeliveryPickupModule,
    AiSettingsModule,
    MenuModule,
    CustomerModule,
    ReservationModule,
    OrderModule,
    AiCoreModule,
    VoiceModule,
    BillingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply Tenant Middleware
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
