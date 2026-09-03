import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Allow public routes (if any) that don't have a user attached.
    // If a route requires authentication, JwtAuthGuard would have already failed before this runs.
    if (!user) {
      return true;
    }

    if (!user.tenantId) {
      throw new ForbiddenException('User does not belong to any tenant/workspace.');
    }

    // Attach tenantId to the request context for easy access downstream
    request.tenantId = user.tenantId;
    return true;
  }
}
