import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class TokensService {
  
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async obtenerUltimoToken(): Promise<Token | undefined> {
    try {
      const tokens = await this.tokenRepository.find({
        order: { 
          updatedAt: 'DESC'
        },
        take: 1
      });
      return tokens[0];
    } catch (error) {
      console.error('Error al obtener último token:', error);
      throw error;
    }
  }

  async guardarOActualizarToken(tokenExterno: string, fecha: Date): Promise<void> {
    try {
      const ultimoToken = await this.obtenerUltimoToken();
      if (ultimoToken) {
        ultimoToken.token = tokenExterno;
        ultimoToken.obtainedAt = fecha;
        ultimoToken.updatedAt = fecha;
        await this.tokenRepository.save(ultimoToken);
      } else {
        const nuevoToken = this.tokenRepository.create({
          token: tokenExterno,
          obtainedAt: fecha,
          createdAt: fecha,
          updatedAt: fecha
        });
        await this.tokenRepository.save(nuevoToken);
      }
    } catch (error) {
      console.error('Error al guardar/actualizar token:', error);
      throw error;
    }
  }

  /**
   * Este método verifica si un token necesita ser actualizado. Devuelve `true` si:
   * 1. No existe ningún token, o
   * 2. Han pasado 4 o más días desde la última actualización del token existente
   * 
   * La verificación se realiza calculando la diferencia en días entre la fecha actual 
   * y la fecha de última actualización del token (`updatedAt`).
   */
  async necesitaActualizarToken(): Promise<boolean> {
    try {
      const ultimoToken = await this.obtenerUltimoToken();
      if (!ultimoToken) return true;

      const ahora = new Date();
      const ultimaActualizacion = new Date(ultimoToken.updatedAt);
      const diferenciaTiempo = ahora.getTime() - ultimaActualizacion.getTime();
      const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
      return diferenciaDias >= 1;
    } catch (error) {
      console.error('Error al verificar necesidad de actualización:', error);
      throw error;
    }
  }
}
