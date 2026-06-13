import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user } = req;
    
    // Proceed with the request and log after successful completion
    return next.handle().pipe(
      tap(async () => {
        // Only log modifying requests (POST, PUT, PATCH, DELETE)
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          const action = `${method} ${url}`;
          const userId = user?.userId || 'system';
          
          try {
            await this.prisma.auditLog.create({
              data: {
                action,
                entity: url.split('/')[1] || 'global',
                entityId: 'generic',
                userId,
                newValue: { body: req.body, query: req.query },
              },
            });
          } catch (e) {
            console.error('Audit Log failed:', e);
          }
        }
      }),
    );
  }
}
