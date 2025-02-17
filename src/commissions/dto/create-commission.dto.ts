import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommissionDto {
    @ApiProperty({
        description: `ID del cliente de la compañía.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe existir en la tabla de company_clients`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del cliente de la compañía no puede estar vacío' })
    @IsInt({ message: 'El ID del cliente de la compañía debe ser un número entero' })
    @Min(1, { message: 'El ID del cliente de la compañía debe ser mayor a 0' })
    companyClientId: number;

    @ApiProperty({
        description: `Monto de la recarga.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Representa el monto en la moneda base (ej: centavos)`,
        example: 5000,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El monto de recarga no puede estar vacío' })
    @IsInt({ message: 'El monto de recarga debe ser un número entero' })
    @Min(1, { message: 'El monto de recarga debe ser mayor a 0' })
    recharge: number;

    @ApiProperty({
        description: `Monto de la comisión.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe ser menor que el monto de recarga
        - Representa el valor de la comisión en la moneda base`,
        example: 500,
        minimum: 0
    })
    @IsNotEmpty({ message: 'El monto de la comisión no puede estar vacío' })
    @IsInt({ message: 'El monto de la comisión debe ser un número entero' })
    @Min(0, { message: 'El monto de la comisión no puede ser negativo' })
    commission: number;

    @ApiPropertyOptional({
        description: `ID del reporte de comisión asociado.
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de commission_reports`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID del reporte de comisión debe ser un número entero' })
    @Min(1, { message: 'El ID del reporte de comisión debe ser mayor a 0' })
    commissionReportId?: number;

    @ApiPropertyOptional({
        description: `ID del movimiento del plan de recarga.
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de recharge_plan_movements`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID del movimiento del plan de recarga debe ser un número entero' })
    @Min(1, { message: 'El ID del movimiento del plan de recarga debe ser mayor a 0' })
    rechargePlanMovementId?: number;

    @ApiPropertyOptional({
        description: `Timestamp de activación.
        Validaciones:
        - Debe ser un número entero (timestamp en milisegundos)
        - Debe ser una fecha válida`,
        example: 1647356400000
    })
    @IsOptional()
    @IsInt({ message: 'El timestamp de activación debe ser un número entero' })
    @Min(0, { message: 'El timestamp de activación no puede ser negativo' })
    activation?: number;

    @ApiPropertyOptional({
        description: `Estado de activación de la comisión.
        Validaciones:
        - Debe ser un valor booleano
        - Valor por defecto: true`,
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado de activación debe ser un valor booleano' })
    isActive?: boolean = true;
}
