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
import { JwtService } from '@nestjs/jwt';

@ApiTags('Autenticación')
@Controller('auth')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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

  @Post('request-reset-password')
  @Public()
  @ApiOperation({
    summary: 'Solicitar restauración de contraseña',
    description: `
      Envía un correo electrónico con un enlace para restaurar la contraseña.
      
      Proceso:
      - Valida el email proporcionado
      - Genera un token temporal
      - Envía email con instrucciones
      - El token expira en 1 hora
    `
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Correo electrónico registrado del usuario',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo de restauración enviado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Email no encontrado en el sistema',
  })
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({
    summary: 'Restaurar contraseña',
    description: `
      Actualiza la contraseña del usuario usando el token de restauración.
      
      Validaciones:
      - Token válido y no expirado
      - Nueva contraseña cumple requisitos de seguridad
      - Confirmación de contraseña coincide
      - Token de uso único
    `
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token', 'newPassword', 'confirmPassword'],
      properties: {
        token: {
          type: 'string',
          description: 'Token de restauración recibido por email',
        },
        newPassword: {
          type: 'string',
          description: 'Nueva contraseña',
          minLength: 8,
        },
        confirmPassword: {
          type: 'string',
          description: 'Confirmación de la nueva contraseña',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o contraseñas no coinciden',
  })
  @ApiResponse({
    status: 401,
    description: 'Token expirado',
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword, confirmPassword);
  }

  @Post('verify-reset-token')
  @Public()
  @ApiOperation({
    summary: 'Verificar token de restauración',
    description: `
      Verifica si el token de restauración es válido y no ha expirado.
      
      Validaciones:
      - Token debe existir
      - No debe haber expirado
    `
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token'],
      properties: {
        token: {
          type: 'string',
          description: 'Token de restauración recibido por email',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido',
  })
  async verifyResetToken(@Body('token') token: string) {
    return this.authService.verifyResetToken(token);
  }
}
