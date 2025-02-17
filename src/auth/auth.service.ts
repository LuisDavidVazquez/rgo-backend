import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { Permission } from 'src/permissions/entities/permission.entity';
import { UsersService } from 'src/users/users.service';
import { Client } from 'src/clients/entities/client.entity';
import { ClientsService } from 'src/clients/clients.service';
import { TokensService } from 'src/tokens/tokens.service';
import { Console } from 'console';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private clientService: ClientsService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private httpService: HttpService, // Añade HttpService para hacer solicitudes HTTP
    private tokenService: TokensService, // Asume un servicio para manejar tokens en tu DB
  ) { }



  async signIn(email: string, pass: string): Promise<any> {
      console.log(email, pass, 'email, pass')
    try {
        // Primero intentamos buscar en usuarios
        const tempUser = new User();
        const emailHash = tempUser.hashField(email);
        
        console.log('Buscando usuario con email hash:', emailHash);

        let user;

        try {
            user = await this.usersService.findByEmailHash(email);
            console.log('userdentro del try', user)
        } catch (error) {
            console.log('Error buscando usuario:', error);
        }

        // Si no hay usuario, buscamos en clientes
        if (!user) {
            let client;
            
            try {
                client = await this.clientService.findOneByEmail(email);
                console.log('client', client)

                if (!client) {
                    //console.log('client no encontrado')
                    throw new UnauthorizedException('Usuario no encontrado');
                }

                // Validar que client.password existe
                if (!client.password) {
                    //console.log('client.password no existe')
                    throw new UnauthorizedException('Error de autenticación');
                }

               // console.log('Comparando contraseñas...');
                //console.log('Pass recibido:', pass);
                //console.log('Pass hasheado en DB:', client.password || user.password);

                const isPasswordMatching = await bcrypt.compare(pass, client.password);

                if (!isPasswordMatching) {
                    throw new UnauthorizedException('Contraseña incorrecta');
                }

                // Asegurarse de que el nombre no sea undefined
                const clientName = client.name || user.username || 'Usuario sin nombre';

                const payload = {
                    id: client.id,
                    email: client.email,
                    name: clientName, // Usar el nombre validado
                    clientlevel: client.clientLevel,
                    phone: client.phone,
                    permission: client.permission,
                    gps: client.gps
                };
                //console.log('payload', payload)

                // Verificar el payload antes de generar el token
                // console.log('Payload del token:', payload);

                return {
                    access_token: await this.jwtService.signAsync(payload),
                    user: {
                        id: client.id,
                        email: client.email,
                        name: clientName,
                        clientLevel: client.clientLevel,
                        phone: client.phone,
                        permission: client.permission,
                    }
                };

            } catch (error) {
                // console.log('Error en autenticación de cliente:', error);
                throw new UnauthorizedException('Error en la autenticación');
            }
        }

        // Autenticación para usuario
        const isPasswordMatching = await bcrypt.compare(pass, user.password);

        if (!isPasswordMatching) {
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        // Asegurarse de que el nombre no sea undefined para usuarios
        const userName = user.username || 'Usuario sin nombre';

        const payload = {
            id: user.id,
            email: user.email,
            name: userName,
            clientlevel: user.clientLevel,
            phone: user.phone,
            permission: user.permission,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                name: userName,
                clientLevel: user.clientLevel,
                phone: user.phone,
                permission: user.permission,
            }
        };
    } catch (error) {
        console.error('Error en signIn:', error);
        throw error;
    }
  }

  async obtenerYGuardarTokenExterno(): Promise<{ message: string }> {
    const url = 'https://authconnectivity.qasar.app/api-auth/auth/singIn';
    const credenciales = {
      email: 'lara.developer@rastreogo.com',
      password: 'Hola1234%',
    };

    try {
      // console.log('Obteniendo token externo...');
      // Intenta hacer la petición POST con más detalles de error
      const response = await firstValueFrom(
        this.httpService.post(url, credenciales, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: (status) => {
            return status < 500; // Permite manejar errores 4xx
          }
        }),
      ).catch(error => {
        console.error('Error detallado:', {
          config: error.config,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      });

      // Verifica el status de la respuesta
      if (response.status !== 200) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }

      const tokenExterno = response.data.access_token;
      // console.log('Respuesta completa:', response.data);

      if (!tokenExterno) {
        console.error('No se recibió token. Respuesta completa:', response.data);
        throw new Error('Token no recibido de la API externa');
      }

      const fechaActual = new Date();
      await this.tokenService.guardarOActualizarToken(tokenExterno, fechaActual);

      return {
        message: 'Token externo obtenido y guardado exitosamente'
      };

    } catch (error) {
      console.error('Error detallado al obtener token:', {
        statusCode: error.response?.status,
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.error,
        stack: error.stack
      });

      if (error.response?.status === 401) {
        throw new UnauthorizedException('Credenciales inválidas para el servicio externo. Verifique email y contraseña.');
      }

      throw new UnauthorizedException(
        `Error al obtener el token externo: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // Este cron se ejecutará a las 12:02 AM todos los días
  // El formato es: minuto hora día-del-mes mes día-de-la-semana
  // 2 = minuto 2
  // 0 = hora 0 (medianoche/12 AM)
  // * = todos los días del mes
  // * = todos los meses
  // * = todos los días de la semana
  @Cron("2 0 * * *")
  async verificarYActualizarTokenExterno() {
    try {
      const necesitaActualizar = await this.tokenService.necesitaActualizarToken();
      if (necesitaActualizar) {
        await this.obtenerYGuardarTokenExterno();
        // console.log('Token externo actualizado exitosamente');
      } else {
        // console.log('No es necesario actualizar el token en este momento');
      }
    } catch (error) {
      console.error('Error al verificar/actualizar token:', error);
    }
  }

  calcularDiasDesde(fecha: Date): number {
    const ahora = new Date();
    const diferenciaTiempo = ahora.getTime() - fecha.getTime();
    const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
    return Math.floor(diferenciaDias);
  }

  async actualizarTokenExterno() {
    // Implementa la lógica para obtener un nuevo token y guardarlo
    // console.log('Actualizando token...');
    // Asegúrate de actualizar la fecha de última actualización en tu TokenService
  }



  // async signIn(username: string, pass: string) {
  //   const user = await this.usuariosRastreoGoservice.findOne(username);

  //   if (!user) {
  //     throw new UnauthorizedException('Usuario no encontrado');
  //   }

  //   const isPasswordMatching = await bcrypt.compare(pass, user.password);
  //   if (!isPasswordMatching) {
  //     throw new UnauthorizedException('Contraseña incorrecta');
  //   }

  //   const payload = { username: user.username, sub: user.id };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
}