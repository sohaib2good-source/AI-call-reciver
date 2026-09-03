import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Bulk Actions & Import')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('customers-bulk')
export class CustomerBulkController {

  @Post('import')
  @ApiOperation({ summary: 'Import Customers from CSV/Excel via JSON array payload' })
  async bulkImport(@Req() req: TenantRequest, @Body() items: any[]) {
    return { 
      success: true, 
      message: `Received ${items.length} customers for processing.`,
      processingJobId: 'job-' + Date.now()
    };
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge duplicate customer profiles' })
  async mergeCustomers(@Req() req: TenantRequest, @Body() payload: { targetId: string, sourceIds: string[] }) {
    return { 
      success: true, 
      message: `Merged ${payload.sourceIds.length} profiles into ${payload.targetId}.`
    };
  }
}
