import { forwardRef, Module } from '@nestjs/common';
import { SimClientIccidsService } from './sim_client_iccids.service';
import { SimClientIccidsController } from './sim_client_iccids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimClientIccid } from './entities/sim_client_iccid.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import { ClientIccidsModule } from 'src/client_iccids/client_iccids.module';
@Module({
  imports: [TypeOrmModule.forFeature([SimClientIccid, Sim, ClientIccid]),
    forwardRef(() => ClientIccidsModule),
  ],
  controllers: [SimClientIccidsController],
  providers: [SimClientIccidsService],
  exports: [SimClientIccidsService, TypeOrmModule],
})
export class SimClientIccidsModule {}
