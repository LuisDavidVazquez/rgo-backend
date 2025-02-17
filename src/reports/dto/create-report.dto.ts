import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
    @ApiProperty({
        description: `ID del reporte.
        Validaciones:
        - Debe ser un número entero positivo
        - No puede estar vacío`,
        example: 1
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        description: `ID de comisiones asociadas.
        Validaciones:
        - Debe ser un número entero positivo
        - No puede estar vacío`,
        example: 1234
    })
    @IsNumber()
    idcomisiones: number;
}
