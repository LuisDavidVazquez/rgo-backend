import { forwardRef, Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Token]),
    forwardRef(() => AuthModule), // Modifica esta línea

],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService,TypeOrmModule], // Exporta el servicio si planeas usarlo en otros módulos
})
export class TokensModule {}
