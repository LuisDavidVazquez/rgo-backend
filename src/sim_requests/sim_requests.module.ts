import { Module } from '@nestjs/common';
import { SimRequestsService } from './sim_requests.service';
import { SimRequestsController } from './sim_requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimRequest } from './entities/sim_request.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SimRequest, Client])],
  controllers: [SimRequestsController],
  providers: [SimRequestsService],
})
export class SimRequestsModule {}
