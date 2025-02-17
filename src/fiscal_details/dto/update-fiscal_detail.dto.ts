import { PartialType } from '@nestjs/swagger';
import { CreateFiscalDetailDto } from './create-fiscal_detail.dto';

export class UpdateFiscalDetailDto extends PartialType(CreateFiscalDetailDto) {}
