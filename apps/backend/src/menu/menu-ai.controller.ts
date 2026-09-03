import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantRequest } from '../common/middleware/tenant.middleware';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Query API')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('ai/menu')
export class MenuAiController {
  constructor(private readonly menuService: MenuService) {}

  @Get('search')
  @ApiOperation({ summary: 'Semantic-friendly search optimized for AI agent consumption' })
  async searchItems(@Req() req: TenantRequest, @Query('q') query: string) {
    if (!query) return { success: true, data: [] };
    
    // AI MUST NOT read DB directly. It calls this API which enforces tenant isolation
    // and returns LLM-friendly payloads to save context window tokens.
    const results = await this.menuService.searchItemsForAi(req.tenantId!, query);
    
    return { success: true, data: results };
  }
}
