import { forwardRef, Module } from '@nestjs/common';
import { ClientIccidsService } from './client_iccids.service';
import { ClientIccidsController } from './client_iccids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientIccid } from './entities/client_iccid.entity';
import { User } from 'src/users/entities/user.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { UsersModule } from 'src/users/users.module';
import { SimsModule } from 'src/sims/sims.module';
import { SimClientIccidsModule } from 'src/sim_client_iccids/sim_client_iccids.module';
import { SimClientIccid } from 'src/sim_client_iccids/entities/sim_client_iccid.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientIccid, User, Sim, SimClientIccid]),
    forwardRef(() => SimsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => SimClientIccidsModule),
    forwardRef(() => AuthModule),

  ],
  controllers: [ClientIccidsController],
  providers: [ClientIccidsService],
  exports: [ClientIccidsService, TypeOrmModule],
})
export class ClientIccidsModule {}
