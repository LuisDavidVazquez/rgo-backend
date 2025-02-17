import { IsNotEmpty, IsOptional, IsString, IsInt, MaxLength, Matches, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum PersonType {
    FISICA = 'FISICA',
    MORAL = 'MORAL'
}

export class CreateFiscalDetailDto {
    @ApiProperty({
        description: `Tipo de persona fiscal.
        Validaciones:
        - No puede estar vacío
        - Debe ser: FISICA o MORAL`,
        enum: PersonType,
        example: 'FISICA'
    })
    @IsNotEmpty({ message: 'El tipo de persona es obligatorio' })
    @IsEnum(PersonType, { message: 'El tipo de persona debe ser FISICA o MORAL' })
    personType: string;

    @ApiProperty({
        description: `RFC (Registro Federal de Contribuyentes).
        Validaciones:
        - No puede estar vacío
        - Debe seguir el formato de RFC mexicano
        - 13 caracteres para personas físicas
        - 12 caracteres para personas morales`,
        example: 'XAXX010101000',
        maxLength: 13
    })
    @IsNotEmpty({ message: 'El RFC es obligatorio' })
    @IsString({ message: 'El RFC debe ser una cadena de texto' })
    @MaxLength(13, { message: 'El RFC no puede exceder los 13 caracteres' })
    @Matches(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, {
        message: 'El RFC debe tener un formato válido'
    })
    rfc: string;

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
        description: `Razón social o nombre comercial.
        Validaciones:
        - Máximo 255 caracteres
        - Solo letras, números, espacios y caracteres especiales básicos`,
        example: 'Empresa Ejemplo S.A. de C.V.',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'La razón social debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La razón social no puede exceder los 255 caracteres' })
    businessName?: string;

    @ApiPropertyOptional({
        description: `Régimen fiscal.
        Validaciones:
        - Máximo 255 caracteres
        - Debe ser un régimen fiscal válido del SAT`,
        example: '601 - General de Ley Personas Morales',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'El régimen fiscal debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El régimen fiscal no puede exceder los 255 caracteres' })
    fiscalRegime?: string;

    @ApiPropertyOptional({
        description: `Uso del CFDI.
        Validaciones:
        - Máximo 255 caracteres
        - Debe ser un uso de CFDI válido del SAT`,
        example: 'G03 - Gastos en general',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'El uso del CFDI debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El uso del CFDI no puede exceder los 255 caracteres' })
    cdfiUsage?: string;

    @ApiPropertyOptional({
        description: `Método de pago.
        Validaciones:
        - Máximo 255 caracteres
        - Debe ser un método de pago válido del SAT`,
        example: 'PUE - Pago en una sola exhibición',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'El método de pago debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El método de pago no puede exceder los 255 caracteres' })
    paymentMethod?: string;

    @ApiPropertyOptional({
        description: `Forma de pago.
        Validaciones:
        - Máximo 255 caracteres
        - Debe ser una forma de pago válida del SAT`,
        example: '01 - Efectivo',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'La forma de pago debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La forma de pago no puede exceder los 255 caracteres' })
    paymentForm?: string;

    @ApiPropertyOptional({
        description: `Moneda de pago.
        Validaciones:
        - Máximo 10 caracteres
        - Debe ser una moneda válida
        - Valor por defecto: MXN`,
        example: 'MXN',
        default: 'MXN',
        maxLength: 10
    })
    @IsOptional()
    @IsString({ message: 'La moneda debe ser una cadena de texto' })
    @MaxLength(10, { message: 'La moneda no puede exceder los 10 caracteres' })
    paymentCurrency?: string = 'MXN';
}
