import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSimRequestDto {
    @ApiProperty({
        description: `ID del cliente solicitante.
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de clientes
        - No puede estar vacío`,
        example: 12345
    })
    @IsNotEmpty({ message: 'El clientId es obligatorio.' })
    @IsInt({ message: 'El clientId debe ser un entero.' })
    clientId: number;

    @ApiProperty({
        description: `Dirección de entrega - Calle y número.
        Validaciones:
        - Longitud: 1-255 caracteres
        - No puede estar vacío`,
        example: "Av. Revolución 123"
    })
    @IsNotEmpty({ message: 'La calle es obligatoria.' })
    @IsString({ message: 'La calle debe ser una cadena de texto.' })
    @Length(1, 255, { message: 'La calle debe tener entre 1 y 255 caracteres.' })
    street: string;

    @IsNotEmpty({ message: 'El barrio es obligatorio.' })
    @IsString({ message: 'El barrio debe ser una cadena de texto.' })
    @Length(1, 255, { message: 'El barrio debe tener entre 1 y 255 caracteres.' })
    neighborhood: string;

    @IsNotEmpty({ message: 'El código postal es obligatorio.' })
    @IsString({ message: 'El código postal debe ser una cadena de texto.' })
    @Length(5, 5, { message: 'El código postal debe tener exactamente 5 caracteres.' })
    postalCode: string;

    @IsNotEmpty({ message: 'El estado es obligatorio.' })
    @IsString({ message: 'El estado debe ser una cadena de texto.' })
    @Length(1, 255, { message: 'El estado debe tener entre 1 y 255 caracteres.' })
    state: string;

    @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
    @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
    @Length(1, 255, { message: 'La ciudad debe tener entre 1 y 255 caracteres.' })
    city: string;

    @ApiProperty({
        description: `Cantidad de SIMs solicitadas.
        Validaciones:
        - Debe ser un número entero positivo
        - Mínimo: 1
        - No puede estar vacío`,
        example: 5,
        minimum: 1
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    requestedSimsQuantity: number;

    @ApiPropertyOptional({
        description: `Nombre del usuario final.
        Validaciones:
        - Longitud máxima: 255 caracteres`,
        example: "Juan Pérez"
    })
    @IsOptional()
    @IsString()
    @Length(0, 255)
    name?: string;

    @IsOptional()
    @IsString({ message: 'El estado de la solicitud debe ser una cadena de texto.' })
    @Length(0, 255, { message: 'El estado de la solicitud no debe exceder los 255 caracteres.' })
    requestStatus?: string;
}
