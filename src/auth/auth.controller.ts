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
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // este decorador es  por si quiero hacer una ruta publica que no este protegida y se pueda acceder sin token
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Credenciales de inicio de sesión',
    //type: Record<string, any>
  })
  signIn(@Body() signInDto: Record<string, any>) {
    //  console.log(signInDto, 'signInDto')
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario encontrado exitosamente.',
    type: CreateClientDto,
  })
  getProfile(@Request() req) {
    return req.user;
  }

  // Ruta para obtener y guardar el token externo
  // Considera proteger esta ruta con un guard si es necesario
  @Public() // Quítalo o reemplázalo por @UseGuards(AuthGuard()) para proteger la ruta
  @Post('obtener-y-guardar-token-externo')
  @ApiOperation({ summary: 'Obtener y guardar el token externo' })
  @ApiResponse({
    status: 200,
    description: 'Token externo obtenido y guardado con éxito.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Token externo a guardar',
    type: String,
  })
  async obtenerYGuardarTokenExterno() {
    await this.authService.obtenerYGuardarTokenExterno();
    return { message: 'Token externo obtenido y guardado con éxito' };
  }
}
