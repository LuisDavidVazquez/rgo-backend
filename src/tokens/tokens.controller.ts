import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  // Nuevo endpoint para obtener y guardar el token externo
  @Post('obtener-y-guardar-token-externo')
  @ApiOperation({ summary: 'Obtener y guardar el token QASAR' })
  @ApiResponse({
    status: 200,
    description: 'Token externo actualizado con éxito',
    type: String
  })
  @ApiResponse({ status: 400, description: 'Error al obtener y guardar el token QASAR' })
  @ApiBody({ type: String })
  @HttpCode(HttpStatus.OK) // Define el código de estado HTTP adecuado
  async obtenerYGuardarTokenExterno() {
    await this.authService.obtenerYGuardarTokenExterno();
    return { message: 'Token externo actualizado con éxito' };
  }
}
