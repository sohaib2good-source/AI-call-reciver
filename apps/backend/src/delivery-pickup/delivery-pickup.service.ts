import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface FullDeliveryPickupConfig {
  delivery: {
    enabled: boolean;
    deliveryRadiusKm: string;
    minimumOrder: string;
    standardDeliveryFee: string;
    estimatedDeliveryMins: string;
  };
  pickup: {
    enabled: boolean;
    preparationTimeMins: string;
    pickupInstructions: string;
  };
}

@Injectable()
export class DeliveryPickupService {
  private readonly logger = new Logger(DeliveryPickupService.name);

  constructor(private prisma: PrismaService) {}

  private async ensureTenant(tenantId: string) {
    try {
      await this.prisma.tenant.upsert({
        where: { id: tenantId },
        create: {
          id: tenantId,
          name: 'AI Restaurant',
          phoneNumbers: ['+1234567890'],
        },
        update: {},
      });
    } catch (e) {
      this.logger.warn(`Tenant upsert note: ${e}`);
    }
  }

  async getDeliverySettings(tenantId: string) {
    return this.prisma.deliverySettings.findUnique({ where: { tenantId } });
  }

  async updateDeliverySettings(tenantId: string, data: any) {
    await this.ensureTenant(tenantId);
    return this.prisma.deliverySettings.upsert({
      where: { tenantId },
      create: { ...data, tenantId },
      update: data,
    });
  }

  async getPickupSettings(tenantId: string) {
    return this.prisma.pickupSettings.findUnique({ where: { tenantId } });
  }

  async updatePickupSettings(tenantId: string, data: any) {
    await this.ensureTenant(tenantId);
    return this.prisma.pickupSettings.upsert({
      where: { tenantId },
      create: { ...data, tenantId },
      update: data,
    });
  }

  // Unified Multi-Device Cloud Config Associated with Login ID / Tenant ID
  async getFullConfig(tenantId: string): Promise<FullDeliveryPickupConfig> {
    const delivery = await this.getDeliverySettings(tenantId);
    const pickup = await this.getPickupSettings(tenantId);

    const deliveryFees = (delivery?.deliveryFees as any) || {};

    return {
      delivery: {
        enabled: deliveryFees.enabled !== false,
        deliveryRadiusKm: delivery?.deliveryRadiusKm != null ? String(delivery.deliveryRadiusKm) : '',
        minimumOrder: delivery?.minimumOrder != null ? String(delivery.minimumOrder) : '',
        standardDeliveryFee: deliveryFees.baseFee != null ? String(deliveryFees.baseFee) : '',
        estimatedDeliveryMins: delivery?.estimatedDeliveryMins != null && delivery.estimatedDeliveryMins > 0 ? String(delivery.estimatedDeliveryMins) : '',
      },
      pickup: {
        enabled: pickup?.pickupAvailability !== false,
        preparationTimeMins: pickup?.preparationTimeMins != null && pickup.preparationTimeMins > 0 ? String(pickup.preparationTimeMins) : '',
        pickupInstructions: pickup?.pickupInstructions || '',
      },
    };
  }

  async saveFullConfig(tenantId: string, config: FullDeliveryPickupConfig) {
    await this.ensureTenant(tenantId);

    const radius = config.delivery?.deliveryRadiusKm ? parseFloat(config.delivery.deliveryRadiusKm) : null;
    const minOrder = config.delivery?.minimumOrder ? parseFloat(config.delivery.minimumOrder) : null;
    const fee = config.delivery?.standardDeliveryFee ? parseFloat(config.delivery.standardDeliveryFee) : null;
    const estDelivery = config.delivery?.estimatedDeliveryMins ? parseInt(config.delivery.estimatedDeliveryMins) : null;

    const prepTime = config.pickup?.preparationTimeMins ? parseInt(config.pickup.preparationTimeMins) : null;
    const pickupInstructions = config.pickup?.pickupInstructions || null;
    const pickupEnabled = config.pickup?.enabled !== false;
    const deliveryEnabled = config.delivery?.enabled !== false;

    // Save Delivery Settings
    const updatedDelivery = await this.prisma.deliverySettings.upsert({
      where: { tenantId },
      create: {
        tenantId,
        deliveryRadiusKm: radius,
        minimumOrder: minOrder,
        estimatedDeliveryMins: estDelivery ?? 0,
        deliveryFees: {
          enabled: deliveryEnabled,
          baseFee: fee,
        },
      },
      update: {
        deliveryRadiusKm: radius,
        minimumOrder: minOrder,
        estimatedDeliveryMins: estDelivery ?? 0,
        deliveryFees: {
          enabled: deliveryEnabled,
          baseFee: fee,
        },
      },
    });

    // Save Pickup Settings
    const updatedPickup = await this.prisma.pickupSettings.upsert({
      where: { tenantId },
      create: {
        tenantId,
        preparationTimeMins: prepTime ?? 0,
        pickupInstructions,
        pickupAvailability: pickupEnabled,
      },
      update: {
        preparationTimeMins: prepTime ?? 0,
        pickupInstructions,
        pickupAvailability: pickupEnabled,
      },
    });

    return {
      success: true,
      tenantId,
      delivery: updatedDelivery,
      pickup: updatedPickup,
    };
  }

  async getAiFulfillmentContext(tenantId: string) {
    const delivery = await this.getDeliverySettings(tenantId);
    const pickup = await this.getPickupSettings(tenantId);

    const deliveryFees = (delivery?.deliveryFees as any) || {};
    const isDeliveryOn = deliveryFees.enabled !== false;
    const isPickupOn = pickup?.pickupAvailability !== false;

    const hasDeliveryTime = isDeliveryOn && delivery?.estimatedDeliveryMins && Number(delivery.estimatedDeliveryMins) > 0;
    const hasPickupTime = isPickupOn && pickup?.preparationTimeMins && Number(pickup.preparationTimeMins) > 0;

    return {
      tenantId,
      delivery: {
        enabled: isDeliveryOn,
        deliveryRadiusKm: delivery?.deliveryRadiusKm ?? null,
        minimumOrder: delivery?.minimumOrder ?? null,
        standardDeliveryFee: deliveryFees.baseFee ?? null,
        estimatedDeliveryMins: hasDeliveryTime ? Number(delivery!.estimatedDeliveryMins) : null,
      },
      pickup: {
        enabled: isPickupOn,
        preparationTimeMins: hasPickupTime ? Number(pickup!.preparationTimeMins) : null,
        pickupAvailability: isPickupOn,
        pickupInstructions: pickup?.pickupInstructions ?? null,
      },
      aiPolicy: {
        isDeliveryEnabled: isDeliveryOn,
        isPickupEnabled: isPickupOn,
        canQuoteDeliveryTime: !!hasDeliveryTime,
        deliveryTimeQuote: !isDeliveryOn
          ? 'Delivery is currently DISABLED. Tell caller delivery is unavailable.'
          : hasDeliveryTime
          ? `Estimated delivery time is approximately ${delivery!.estimatedDeliveryMins} minutes.`
          : 'BLANK: Do NOT state any delivery time. Inform caller that delivery times depend on kitchen volume.',
        canQuotePickupTime: !!hasPickupTime,
        pickupTimeQuote: !isPickupOn
          ? 'Pickup is currently DISABLED. Tell caller pickup is unavailable.'
          : hasPickupTime
          ? `Pickup orders are typically ready in about ${pickup!.preparationTimeMins} minutes.`
          : 'BLANK: Do NOT state any pickup preparation time.',
      },
    };
  }
}
