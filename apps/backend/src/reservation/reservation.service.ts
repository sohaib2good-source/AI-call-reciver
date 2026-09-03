import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from './availability.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService
  ) {}

  async getReservations(tenantId: string, dateStr?: string) {
    const where: any = { tenantId };
    if (dateStr) {
      where.reservationDate = new Date(dateStr);
    }
    return this.prisma.reservation.findMany({
      where,
      include: { customer: true, table: true },
      orderBy: { reservationTime: 'asc' }
    });
  }

  async createReservation(tenantId: string, data: any) {
    // 1. Assign table
    const table = await this.availabilityService.assignBestTable(
      tenantId, 
      data.guests, 
      data.reservationTime, 
      new Date(data.reservationDate), 
      data.areaPreference
    );

    if (!table) {
      throw new Error('No tables available for this time and party size.');
    }

    const resNumber = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prisma.reservation.create({
      data: {
        ...data,
        tenantId,
        reservationNumber: resNumber,
        tableId: table.id,
        reservationDate: new Date(data.reservationDate),
      }
    });
  }

  async updateReservationStatus(tenantId: string, id: string, status: ReservationStatus) {
    return this.prisma.reservation.update({
      where: { id_tenantId: { id, tenantId } } as any,
      data: { status }
    });
  }
}
