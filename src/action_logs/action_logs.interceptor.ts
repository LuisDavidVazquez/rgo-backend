import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { ActionLogsService } from './action_logs.service';
  
  @Injectable()
  export class ActionLogsInterceptor implements NestInterceptor {
    constructor(private actionLogsService: ActionLogsService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const userId = request.user.id; // Asumiendo que tienes un sistema de autenticación
      const method = request.method;
      const path = request.route.path;
  
      return next.handle().pipe(
        tap(() => {
          this.actionLogsService.logAction( 
            `${method} ${path}`,
            userId,
            `Acción realizada por el usuario ID: ${userId}`,
          );
        }),
      );
    }
  }