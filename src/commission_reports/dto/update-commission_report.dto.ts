import { PartialType } from '@nestjs/swagger';
import { CreateCommissionReportDto } from './create-commission_report.dto';

export class UpdateCommissionReportDto extends PartialType(CreateCommissionReportDto) {}
