import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, Matches, Length, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty({
        description: `Calle de la dirección.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres
        - Debe incluir el nombre de la calle
        - Puede incluir números y caracteres especiales`,
        example: 'Av. Insurgentes',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'La calle no puede estar vacía' })
    @IsString({ message: 'La calle debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La calle no puede exceder los 255 caracteres' })
    street: string;

    @ApiPropertyOptional({
        description: `Número exterior.
        Validaciones:
        - Debe ser una cadena de texto
        - Puede incluir letras y números
        - Longitud máxima: 20 caracteres
        - Formato válido: números y letras`,
        example: '123-A',
        maxLength: 20
    })
    @IsOptional()
    @IsString({ message: 'El número exterior debe ser una cadena de texto' })
    @MaxLength(20, { message: 'El número exterior no puede exceder los 20 caracteres' })
    @Matches(/^[0-9A-Za-z\-\/]+$/, { message: 'El número exterior solo puede contener números, letras, guiones y diagonales' })
    externalNumber?: string;

    @ApiPropertyOptional({
        description: `Número interior.
        Validaciones:
        - Debe ser una cadena de texto
        - Puede incluir letras y números
        - Longitud máxima: 20 caracteres
        - Formato válido: números y letras`,
        example: 'B-205',
        maxLength: 20
    })
    @IsOptional()
    @IsString({ message: 'El número interior debe ser una cadena de texto' })
    @MaxLength(20, { message: 'El número interior no puede exceder los 20 caracteres' })
    @Matches(/^[0-9A-Za-z\-\/]+$/, { message: 'El número interior solo puede contener números, letras, guiones y diagonales' })
    innerNumber?: string;

    @ApiProperty({
        description: `Colonia o fraccionamiento.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres`,
        example: 'Col. Del Valle',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'La colonia no puede estar vacía' })
    @IsString({ message: 'La colonia debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La colonia no puede exceder los 255 caracteres' })
    neighborhood: string;

    @ApiProperty({
        description: `Código postal.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero
        - Debe tener exactamente 5 dígitos`,
        example: 29000,
        minimum: 10000,
        maximum: 99999
    })
    @IsNotEmpty({ message: 'El código postal no puede estar vacío' })
    @IsInt({ message: 'El código postal debe ser un número entero' })
    @Min(10000, { message: 'El código postal debe tener 5 dígitos' })
    postalCode: number;

    @ApiProperty({
        description: `Estado.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Debe ser un estado válido de México
        - Longitud máxima: 255 caracteres`,
        example: 'Ciudad de México',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El estado no puede estar vacío' })
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El estado no puede exceder los 255 caracteres' })
    state: string;

    @ApiProperty({
        description: `Ciudad o municipio.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Debe ser un municipio válido del estado seleccionado
        - Longitud máxima: 255 caracteres`,
        example: 'Benito Juárez',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'La ciudad/municipio no puede estar vacía' })
    @IsString({ message: 'La ciudad/municipio debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La ciudad/municipio no puede exceder los 255 caracteres' })
    city: string;

    @ApiProperty({
        description: `País.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Valor por defecto: 'México'
        - Longitud máxima: 255 caracteres`,
        example: 'México',
        default: 'México',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'El país debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El país no puede exceder los 255 caracteres' })
    country?: string;

    @ApiPropertyOptional({
        description: `ID del cliente asociado.
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de clientes`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID del cliente debe ser un número entero' })
    @Min(1, { message: 'El ID del cliente debe ser mayor a 0' })
    clientId?: number;

    @ApiPropertyOptional({
        description: `Indica si es una dirección fiscal.
        Validaciones:
        - Debe ser un valor booleano
        - Valor por defecto: false`,
        example: false,
        default: false
    })
    @IsOptional()
    @IsBoolean({ message: 'El campo isFiscalData debe ser un valor booleano' })
    isFiscalData?: boolean;
}