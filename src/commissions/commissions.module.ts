import { Module } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { CommissionsController } from './commissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commission]), CommissionsModule],
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [TypeOrmModule], // Exportar para que otros módulos puedan usarlo
})
export class CommissionsModule {}
