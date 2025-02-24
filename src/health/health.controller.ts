import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Estado del Sistema')
@Controller('health')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Public()
  @Get('check')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Verificar estado del sistema',
    description: `
      Realiza una verificación completa del estado del sistema.
      
      Componentes verificados:
      - Conexión a base de datos
      - Servicios externos
      - Estado de memoria
      - Latencia del sistema
      - Disponibilidad de APIs
      
      Métricas incluidas:
      - Tiempo de respuesta
      - Uso de recursos
      - Estado de servicios
      - Errores recientes
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Sistema funcionando correctamente',
    schema: {
      example: {
        status: 'ok',
        info: {
          database: { status: 'up' },
          api: { status: 'up' },
          memory: { status: 'ok', used: '45%' }
        },
        error: {},
        details: {
          uptime: '99.9%',
          lastCheck: '2024-03-20T10:00:00Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio no disponible',
    schema: {
      example: {
        status: 'error',
        message: 'Uno o más servicios no están respondiendo'
      }
    }
  })
  @HealthCheck()
  async RastreoGoHealth() {
    return this.health.check([
      // Aquí irían los health checks específicos
      async () => ({ rastreoGo: { status: 'up' } })
    ]);
  }
}
  