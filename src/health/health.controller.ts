import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}


  @Public()
  @Get('check')
  @ApiOperation({ summary: 'Verificar el estado de la aplicación' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la aplicación verificado exitosamente.',
    type: String
  })
  @ApiBody({
    description: 'Respuesta de la aplicación',
    type: String
  })
  @HealthCheck()
  async RastreoGoHealth() {
    return 'true';
  }
}
  