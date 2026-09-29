import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateHolidayDto } from './dto/holiday.dto';

@ApiTags('Business Hours & Holiday Closures')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('business-hours')
export class BusinessHoursController {
  constructor(private readonly hoursService: BusinessHoursService) {}

  // --- Regular Operating Hours ---
  @ApiOperation({ summary: 'Get regular operating hours' })
  @Get()
  async getHours(@Req() req: TenantRequest) {
    const data = await this.hoursService.getHours(req.tenantId!);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Update regular operating hours' })
  @Put()
  async updateHours(@Req() req: TenantRequest, @Body() data: any[]) {
    const updated = await this.hoursService.updateHours(req.tenantId!, data);
    return { success: true, data: updated };
  }

  // --- Holiday Closures (Max 15) ---
  @ApiOperation({ summary: 'Get all scheduled holiday and special closures (up to 15)' })
  @ApiResponse({ status: 200, description: 'List of holidays returned successfully' })
  @Get('holidays')
  async getHolidays(@Req() req: TenantRequest) {
    const holidays = await this.hoursService.getHolidays(req.tenantId!);
    return {
      success: true,
      count: holidays.length,
      maxLimit: 15,
      data: holidays,
    };
  }

  @ApiOperation({ summary: 'Add a new holiday closure (Strict limit: 15 holidays)' })
  @ApiResponse({ status: 201, description: 'Holiday created successfully' })
  @ApiResponse({ status: 400, description: 'Limit reached or invalid date format' })
  @Post('holidays')
  async addHoliday(@Req() req: TenantRequest, @Body() dto: CreateHolidayDto) {
    const holiday = await this.hoursService.addHoliday(req.tenantId!, dto);
    return {
      success: true,
      message: 'Holiday closure added successfully.',
      data: holiday,
    };
  }

  @ApiOperation({ summary: 'Delete a holiday closure by ID' })
  @Delete('holidays/:id')
  async deleteHoliday(@Req() req: TenantRequest, @Param('id') id: string) {
    const result = await this.hoursService.deleteHoliday(req.tenantId!, id);
    return result;
  }

  @ApiOperation({ summary: 'Check if restaurant is closed on a specific date (used by AI voice caller)' })
  @Get('check-holiday')
  async checkHoliday(
    @Req() req: TenantRequest,
    @Query('date') date: string
  ) {
    const result = await this.hoursService.checkIsHoliday(req.tenantId!, date);
    return { success: true, data: result };
  }
}
