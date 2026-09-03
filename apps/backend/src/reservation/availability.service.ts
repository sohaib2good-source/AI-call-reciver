import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  // The engine calculating available time slots
  async checkAvailability(tenantId: string, date: Date, guests: number) {
    // 1. Fetch tables matching capacity
    const tables = await this.prisma.table.findMany({
      where: { 
        area: { tenantId },
        isActive: true,
        status: { notIn: ['MAINTENANCE', 'OUT_OF_SERVICE'] },
        minGuests: { lte: guests },
        maxGuests: { gte: guests }
      }
    });

    if (tables.length === 0) return [];

    // 2. Fetch existing reservations for the day
    // (Normalized date handling would go here, simplified for prototype)
    const reservations = await this.prisma.reservation.findMany({
      where: { 
        tenantId, 
        reservationDate: date,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] }
      }
    });

    // 3. Generate slots (e.g., every 30 mins)
    const slots = [];
    const openTime = 11; // 11 AM
    const closeTime = 22; // 10 PM
    
    for (let hour = openTime; hour < closeTime; hour++) {
      for (const minute of ['00', '30']) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
        
        // Find if ANY table is free at this time (naive overlap check)
        // A real check would look at reservationTime + estimatedDuration + cleaningBuffer
        const isAvailable = tables.some(table => {
          const conflictingRes = reservations.find(r => r.tableId === table.id && r.reservationTime === timeString);
          return !conflictingRes;
        });

        if (isAvailable) {
          slots.push({ time: timeString, available: true });
        }
      }
    }

    return slots;
  }

  // Smart Assignment
  async assignBestTable(tenantId: string, guests: number, time: string, date: Date, areaPreference?: string) {
    const availableTables = await this.prisma.table.findMany({
      where: {
        area: { tenantId },
        minGuests: { lte: guests },
        maxGuests: { gte: guests },
        isActive: true,
      },
      orderBy: { reservationPriority: 'desc' }
    });

    // Sort/Filter by Area Preference
    const preferredTables = areaPreference 
      ? availableTables.filter(t => t.areaId === areaPreference)
      : availableTables;

    // Return the first available table (simplified logic)
    return preferredTables.length > 0 ? preferredTables[0] : null;
  }
}
