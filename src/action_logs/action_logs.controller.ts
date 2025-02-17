import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionLogsService } from './action_logs.service';
import { CreateActionLogDto } from './dto/create-action_log.dto';
import { UpdateActionLogDto } from './dto/update-action_log.dto';

@Controller('action-logs')
export class ActionLogsController {
  constructor(private readonly actionLogsService: ActionLogsService) {}

  @Post()
  create(@Body() createActionLogDto: CreateActionLogDto) {
    return this.actionLogsService.create(createActionLogDto);
  }

  @Get()
  findAll() {
    return this.actionLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionLogDto: UpdateActionLogDto) {
    return this.actionLogsService.update(+id, updateActionLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionLogsService.remove(+id);
  }
}
