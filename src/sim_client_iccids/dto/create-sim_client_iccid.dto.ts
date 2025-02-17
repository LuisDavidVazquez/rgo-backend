import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSimClientIccidDto {
    @ApiProperty({
        description: `ID de la SIM.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe existir en la tabla de SIMs`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID de la SIM es obligatorio' })
    @IsInt({ message: 'El ID de la SIM debe ser un número entero' })
    @Min(1, { message: 'El ID de la SIM debe ser mayor a 0' })
    simId: number;

    @ApiProperty({
        description: `ID del cliente ICCID.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe existir en la tabla de client_iccids`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del cliente ICCID es obligatorio' })
    @IsInt({ message: 'El ID del cliente ICCID debe ser un número entero' })
    @Min(1, { message: 'El ID del cliente ICCID debe ser mayor a 0' })
    clientIccidId: number;
}
