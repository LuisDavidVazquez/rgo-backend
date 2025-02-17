import { forwardRef, Module } from '@nestjs/common';
import { SimInventoriesService } from './sim_inventories.service';
import { SimInventoriesController } from './sim_inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimInventory } from './entities/sim_inventory.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { HttpModule } from '@nestjs/axios';
import { TokensModule } from 'src/tokens/tokens.module';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SimInventory, Sim]),
  HttpModule,
  forwardRef(() => ClientsModule),
  TokensModule,
  forwardRef(() => AuthModule),
],
  controllers: [SimInventoriesController],
  providers: [SimInventoriesService],
  exports: [SimInventoriesService]
})
export class SimInventoriesModule {}
