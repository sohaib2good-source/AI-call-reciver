import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantRequest } from '../middleware/tenant.middleware';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    
    if (!request.tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }
    
    return true;
  }
}
