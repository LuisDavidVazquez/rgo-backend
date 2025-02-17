import { Injectable } from '@nestjs/common';
import { CreateActionLogDto } from './dto/create-action_log.dto';
import { UpdateActionLogDto } from './dto/update-action_log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionLog } from './entities/action_log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionLogsService {
  constructor(
    @InjectRepository(ActionLog)
    private actionLogRepository: Repository<ActionLog>,
  ) {}


  async createAuditRecord(action: string, changes: any): Promise<void> {
    const auditRecord = this.actionLogRepository.create({ action, changes });
    await this.actionLogRepository.save(auditRecord);
  }


  async logAction(action: string, userId: number, description: string): Promise<void> {
    const newLog = this.actionLogRepository.create({
      action,
      changes: { userId }, // Ajusta según lo que quieras guardar en 'changes'
      description,
      // 'timestamp' no es necesario si usas @CreateDateColumn
    });

    await this.actionLogRepository.save(newLog);
  }

  async logUpdateUser(userId: number, changes: any): Promise<void> {
    await this.createAuditRecord('UPDATE_USER', {
      userId,
      changes,
      action: 'Usuario actualizado',
    });
  }

  async logDeleteUser(userId: number): Promise<void> {
    await this.createAuditRecord('DELETE_USER', {
      userId,
      action: 'Usuario eliminado',
    });
  }

  create(createActionLogDto: CreateActionLogDto) {
    return 'This action adds a new actionLog';
  }

  findAll() {
    return `This action returns all actionLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} actionLog`;
  }

  update(id: number, updateActionLogDto: UpdateActionLogDto) {
    return `This action updates a #${id} actionLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} actionLog`;
  }
}
