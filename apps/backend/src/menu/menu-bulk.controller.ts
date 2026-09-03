import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Bulk Actions & Import')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('menu-bulk')
export class MenuBulkController {
  constructor(private readonly menuService: MenuService) {}

  @Post('import')
  @ApiOperation({ summary: 'Import Menu from CSV/Excel via JSON array payload' })
  async bulkImport(@Req() req: TenantRequest, @Body() items: any[]) {
    // Stub: Real implementation would parse structure, validate rows, 
    // and orchestrate a huge prisma transaction.
    return { 
      success: true, 
      message: `Received ${items.length} items for processing.`,
      processingJobId: 'job-' + Date.now()
    };
  }

  @Post('export')
  @ApiOperation({ summary: 'Export Menu to JSON/CSV format' })
  async bulkExport(@Req() req: TenantRequest) {
    // Stub: Generates complete export
    return { 
      success: true, 
      downloadUrl: `https://storage.provider.com/exports/${req.tenantId}/menu.csv`
    };
  }
}
