import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';

@ApiTags('Autenticación')
@Controller('auth')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: `
      Autentica un usuario en el sistema.
      
      Proceso:
      - Valida credenciales
      - Genera token JWT
      - Registra inicio de sesión
      
      Validaciones:
      - Email existente
      - Contraseña correcta
      - Usuario activo
      - Permisos vigentes
    `
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'usuario@ejemplo.com',
          description: 'Email del usuario'
        },
        password: {
          type: 'string',
          example: '********',
          description: 'Contraseña del usuario'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token JWT para autenticación'
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            name: { type: 'string' },
            clientLevel: { type: 'string' },
            permissions: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  })
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: `
      Retorna información del usuario autenticado.
      
      Información incluida:
      - Datos personales
      - Nivel de acceso
      - Permisos asignados
      - Última actividad
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
        clientLevel: { type: 'string' },
        permissions: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('obtener-y-guardar-token-externo')
  @ApiOperation({
    summary: 'Obtener y guardar token externo',
    description: `
      Obtiene y almacena un token de autenticación externo.
      
      Proceso:
      - Solicita token al servicio externo
      - Valida respuesta
      - Almacena token
      - Actualiza fecha de expiración
      
      Consideraciones:
      - Token válido por 24 horas
      - Renovación automática
      - Registro de intentos
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Token externo obtenido y guardado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string',
          example: 'Token externo obtenido y guardado exitosamente'
        }
      }
    }
  })
  async obtenerYGuardarTokenExterno() {
    return await this.authService.obtenerYGuardarTokenExterno();
  }
}
