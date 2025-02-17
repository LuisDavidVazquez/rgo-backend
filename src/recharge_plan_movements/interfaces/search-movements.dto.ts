import { IsBoolean, IsString } from 'class-validator';
import { IsNumber } from 'class-validator';
import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchMovementsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFirstPost?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}
