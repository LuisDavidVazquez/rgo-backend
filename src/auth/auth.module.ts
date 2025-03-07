import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule } from 'src/clients/clients.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/Mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    forwardRef(() => UsersModule), // Usa forwardRef para evitar dependencias circulares
    forwardRef(() => ClientsModule), // Usa forwardRef para evitar dependencias circulares
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5d' },
    }),
    HttpModule, // Asegúrate de agregar esto si estás utilizando HttpService en AuthService
    forwardRef(() => TokensModule), // Modifica esta línea
    MailModule,
  ],
  providers: [
    AuthService, 
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  controllers: [AuthController],
  exports: [AuthService,JwtModule],
})
export class AuthModule {}