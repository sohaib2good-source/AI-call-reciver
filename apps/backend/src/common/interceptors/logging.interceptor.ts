import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const requestId = uuidv4();
    req.requestId = requestId;

    const { method, url } = req;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => {
          const res = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          this.logger.log(`[${requestId}] ${method} ${url} ${res.statusCode} - ${delay}ms`);
        }),
      );
  }
}
