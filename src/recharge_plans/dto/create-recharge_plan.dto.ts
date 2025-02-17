import { IsInt, IsOptional, IsString, Min, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRechargePlanDto {
    @ApiProperty({
        description: `Monto del plan de recarga.
        Validaciones:
        - Debe ser un número positivo
        - No puede estar vacío
        - Debe representar el valor en la moneda base (ej: centavos)`,
        example: 15000,
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({
        description: `Duración del plan en días.
        Validaciones:
        - Debe ser un número entero positivo
        - No puede estar vacío
        - Mínimo 1 día`,
        example: 30,
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    days: number;

    @ApiPropertyOptional({
        description: `Nombre del plan de recarga.
        Validaciones:
        - Debe ser una cadena de texto
        - Opcional`,
        example: "Plan Mensual Premium"
    })
    @IsOptional()
    @IsString()
    name?: string;
}
