import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHolidayDto {
  @ApiProperty({ description: 'Name or reason for the holiday/closure', example: 'Eid-ul-Fitr' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ description: 'Start date of the holiday (YYYY-MM-DD)', example: '2026-09-10' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ description: 'End date for multi-day closures (YYYY-MM-DD)', example: '2026-09-12' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Custom announcement message read by the AI voice agent when customers call',
    example: 'Our restaurant is closed today for Eid celebrations and will reopen tomorrow.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  aiMessage?: string;

  @ApiPropertyOptional({ description: 'Whether all 3 operating shifts are suspended', default: true })
  @IsBoolean()
  @IsOptional()
  allShiftsSuspended?: boolean;
}

export interface HolidayResponseDto {
  id: string;
  name: string;
  date: string;
  endDate: string;
  allShiftsSuspended: boolean;
  aiMessage: string;
  status: 'TODAY' | 'UPCOMING' | 'PAST';
  createdAt: string;
}
