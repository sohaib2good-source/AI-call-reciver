import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHolidayDto, HolidayResponseDto } from './dto/holiday.dto';

const MAX_HOLIDAYS_PER_TENANT = 15;

@Injectable()
export class BusinessHoursService {
  private readonly logger = new Logger(BusinessHoursService.name);

  constructor(private prisma: PrismaService) {}

  // 1. Regular Operating Hours
  async getHours(tenantId: string) {
    return this.prisma.businessHours.findMany({
      where: {
        tenantId,
        type: { notIn: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateHours(tenantId: string, hours: any[]) {
    // Delete existing regular hours (keep holidays untouched)
    await this.prisma.businessHours.deleteMany({
      where: {
        tenantId,
        type: { notIn: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
      },
    });

    const data = hours.map((h) => ({
      ...h,
      tenantId,
      type: h.type || 'NORMAL',
    }));

    await this.prisma.businessHours.createMany({
      data,
    });

    return this.getHours(tenantId);
  }

  // 2. Holiday Closures Management (Up to 15 Holidays)
  async getHolidays(tenantId: string): Promise<HolidayResponseDto[]> {
    const rawHolidays = await this.prisma.businessHours.findMany({
      where: {
        tenantId,
        type: { in: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
      },
      orderBy: { startDate: 'asc' },
    });

    const todayStr = new Date().toISOString().split('T')[0];

    return rawHolidays.map((item) => {
      const startDateStr = item.startDate
        ? new Date(item.startDate).toISOString().split('T')[0]
        : todayStr;
      const endDateStr = item.endDate
        ? new Date(item.endDate).toISOString().split('T')[0]
        : startDateStr;

      let status: 'TODAY' | 'UPCOMING' | 'PAST' = 'UPCOMING';
      if (todayStr >= startDateStr && todayStr <= endDateStr) {
        status = 'TODAY';
      } else if (todayStr > endDateStr) {
        status = 'PAST';
      }

      // Name and custom message (stored in name/notes or fallback in openTime/closeTime)
      const name = (item as any).name || item.openTime || 'Special Closure';
      const aiMessage =
        (item as any).notes ||
        item.closeTime ||
        `Our restaurant is closed for ${name}. We look forward to serving you when we reopen!`;

      return {
        id: item.id,
        name,
        date: startDateStr,
        endDate: endDateStr,
        allShiftsSuspended: item.isClosed ?? true,
        aiMessage,
        status,
        createdAt: (item as any).createdAt ? (item as any).createdAt.toISOString() : new Date().toISOString(),
      };
    });
  }

  async addHoliday(tenantId: string, dto: CreateHolidayDto): Promise<HolidayResponseDto> {
    // Check strict 15-holiday ceiling
    const existingCount = await this.prisma.businessHours.count({
      where: {
        tenantId,
        type: { in: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
      },
    });

    if (existingCount >= MAX_HOLIDAYS_PER_TENANT) {
      throw new BadRequestException(
        `Maximum limit of ${MAX_HOLIDAYS_PER_TENANT} holidays reached. Please remove an existing holiday before adding a new one.`
      );
    }

    const startDate = new Date(dto.date);
    const endDate = dto.endDate ? new Date(dto.endDate) : new Date(dto.date);

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date format. Expected YYYY-MM-DD.');
    }
    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid end date format. Expected YYYY-MM-DD.');
    }
    if (endDate < startDate) {
      throw new BadRequestException('End date cannot be earlier than start date.');
    }

    const defaultAiMessage =
      dto.aiMessage ||
      `Our restaurant is closed on this day for ${dto.name}. We look forward to serving you when we reopen!`;

    const created = await this.prisma.businessHours.create({
      data: {
        tenantId,
        type: 'HOLIDAY' as any,
        startDate,
        endDate,
        isClosed: dto.allShiftsSuspended ?? true,
        // Store in openTime/closeTime as safe fields and name/notes if supported
        openTime: dto.name,
        closeTime: defaultAiMessage,
        ...((this.prisma as any)._hasNameField ? { name: dto.name, notes: defaultAiMessage } : {}),
      },
    });

    const dateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    let status: 'TODAY' | 'UPCOMING' | 'PAST' = 'UPCOMING';
    if (todayStr >= dateStr && todayStr <= endDateStr) {
      status = 'TODAY';
    } else if (todayStr > endDateStr) {
      status = 'PAST';
    }

    return {
      id: created.id,
      name: dto.name,
      date: dateStr,
      endDate: endDateStr,
      allShiftsSuspended: created.isClosed,
      aiMessage: defaultAiMessage,
      status,
      createdAt: new Date().toISOString(),
    };
  }

  async deleteHoliday(tenantId: string, id: string): Promise<{ success: boolean; message: string }> {
    const holiday = await this.prisma.businessHours.findFirst({
      where: {
        id,
        tenantId,
        type: { in: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
      },
    });

    if (!holiday) {
      throw new NotFoundException(`Holiday closure with ID ${id} not found.`);
    }

    await this.prisma.businessHours.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Holiday closure deleted successfully.',
    };
  }

  // Helper used by AI Agent / Tool Registry to check if restaurant is closed on a specific date
  async checkIsHoliday(
    tenantId: string,
    targetDateStr: string
  ): Promise<{
    isHoliday: boolean;
    holidayName?: string;
    aiMessage?: string;
  }> {
    const targetDate = new Date(targetDateStr);
    if (isNaN(targetDate.getTime())) {
      return { isHoliday: false };
    }

    const holidays = await this.prisma.businessHours.findMany({
      where: {
        tenantId,
        type: { in: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
        isClosed: true,
      },
    });

    const formattedTarget = targetDate.toISOString().split('T')[0];

    for (const h of holidays) {
      if (!h.startDate) continue;
      const start = new Date(h.startDate).toISOString().split('T')[0];
      const end = h.endDate
        ? new Date(h.endDate).toISOString().split('T')[0]
        : start;

      if (formattedTarget >= start && formattedTarget <= end) {
        const holidayName = (h as any).name || h.openTime || 'Special Holiday';
        const aiMessage =
          (h as any).notes ||
          h.closeTime ||
          `I am sorry, our restaurant is closed on ${formattedTarget} for ${holidayName}.`;

        return {
          isHoliday: true,
          holidayName,
          aiMessage,
        };
      }
    }

    return { isHoliday: false };
  }
}
