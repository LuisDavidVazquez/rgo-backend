import { IsInt, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommissionReportDto {
    @ApiProperty({
        description: `ID de la comisión asociada.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe existir en la tabla de comisiones
        - Se utiliza para relacionar el reporte con una comisión específica`,
        example: 1,
        minimum: 1
    })
    @IsInt({ message: 'El ID de la comisión debe ser un número entero' })
    @Min(1, { message: 'El ID de la comisión debe ser mayor a 0' })
    commissionId: number;

    @ApiPropertyOptional({
        description: `Estado de activación del reporte.
        Validaciones:
        - Debe ser un valor booleano
        - Valor por defecto: true
        - Indica si el reporte está activo o ha sido desactivado`,
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado de activación debe ser un valor booleano' })
    isActive?: boolean = true;
}
