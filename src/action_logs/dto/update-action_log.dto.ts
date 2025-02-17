import { PartialType } from '@nestjs/swagger';
import { CreateActionLogDto } from './create-action_log.dto';

export class UpdateActionLogDto extends PartialType(CreateActionLogDto) {}
