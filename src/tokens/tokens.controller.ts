import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Tokens')
@Controller('tokens')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class TokensController {
  constructor(
    private readonly tokensService: TokensService
  ) {}

  @Public()
  @Post('obtener-y-guardar-token-externo')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Obtener y guardar token QASAR',
    description: `
      Obtiene un nuevo token del servicio externo QASAR y lo almacena.
      
      Reglas de negocio:
      - Se actualiza automáticamente si han pasado más de 24 horas
      - Mantiene un historial de tokens obtenidos
      - Solo guarda un token activo a la vez
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Token externo actualizado con éxito',
    schema: {
      example: {
        message: 'Token externo actualizado con éxito',
        obtainedAt: '2024-03-20T10:00:00Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error al obtener y guardar el token QASAR',
    schema: {
      example: {
        message: 'Error al obtener token externo',
        error: 'Servicio QASAR no disponible'
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  async obtenerYGuardarTokenExterno() {
    await this.tokensService.obtenerUltimoToken();
    return { message: 'Token externo actualizado con éxito' };
  }

  @ApiBearerAuth('access-token')
  @Get('ultimo')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener último token',
    description: `
      Retorna el token más reciente almacenado en el sistema.
      
      Información retornada:
      - Token
      - Fecha de obtención
      - Fecha de expiración
      - Estado de validez
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Token encontrado exitosamente',
    schema: {
      example: {
        id: 1,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        obtainedAt: '2024-03-20T10:00:00Z',
        expiresAt: '2024-03-21T10:00:00Z'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'No hay tokens almacenados',
    schema: {
      example: {
        message: 'No se encontró ningún token'
      }
    }
  })
  async obtenerUltimoToken() {
    return await this.tokensService.obtenerUltimoToken();
  }

  @ApiBearerAuth('access-token')
  @Get('verificar-estado')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Verificar estado del token',
    description: `
      Verifica si el token actual necesita ser actualizado.
      
      Criterios de verificación:
      - Tiempo transcurrido desde última actualización
      - Estado de validez del token
      - Proximidad a fecha de expiración
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del token verificado',
    schema: {
      example: {
        necesitaActualizacion: true,
        diasRestantes: 2,
        ultimaActualizacion: '2024-03-18T10:00:00Z'
      }
    }
  })
  async verificarEstadoToken() {
    return await this.tokensService.necesitaActualizarToken();
  }
}
