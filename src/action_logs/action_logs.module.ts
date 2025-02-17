import { forwardRef, Module } from '@nestjs/common';
import { ActionLogsService } from './action_logs.service';
import { ActionLogsController } from './action_logs.controller';
import { ActionLog } from './entities/action_log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog]),
    forwardRef(() => UsersModule)
],
  controllers: [ActionLogsController],
  providers: [ActionLogsService],
  exports: [ActionLogsService], // Asegúrate de exportar ActionLogsService
})
export class ActionLogsModule {}
