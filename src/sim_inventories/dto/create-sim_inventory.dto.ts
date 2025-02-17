import { IsBoolean, IsInt, IsOptional, IsString, IsDate, MaxLength, Min, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSimInventoryDto {
    @ApiProperty({
        description: `ID del cliente de la compañía.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del cliente de la compañía es obligatorio' })
    @IsInt({ message: 'El ID del cliente de la compañía debe ser un número entero' })
    @Min(1, { message: 'El ID del cliente de la compañía debe ser mayor a 0' })
    companyClient: number;

    @ApiProperty({
        description: `ID del estado.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del estado es obligatorio' })
    @IsInt({ message: 'El ID del estado debe ser un número entero' })
    @Min(1, { message: 'El ID del estado debe ser mayor a 0' })
    statusId: number;

    @ApiProperty({
        description: `Estado de la SIM.
        Validaciones:
        - No puede estar vacío
        - Longitud máxima: 255 caracteres`,
        example: 'ACTIVA',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El estado no debe exceder los 255 caracteres' })
    status: string;

    @ApiProperty({
        description: `Nombre del cliente.
        Validaciones:
        - No puede estar vacío
        - Longitud máxima: 255 caracteres`,
        example: 'Juan Pérez',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
    @IsString({ message: 'El nombre del cliente debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El nombre del cliente no debe exceder los 255 caracteres' })
    client: string;

    @ApiPropertyOptional({
        description: `Nombre de la SIM.
        Validaciones:
        - Longitud máxima: 255 caracteres`,
        example: 'SIM Principal',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El nombre no debe exceder los 255 caracteres' })
    name?: string;

    @ApiPropertyOptional({
        description: `Días de vigencia.
        Validaciones:
        - Debe ser un número entero no negativo`,
        example: 30,
        minimum: 0
    })
    @IsOptional()
    @IsInt({ message: 'Los días deben ser un número entero' })
    @Min(0, { message: 'Los días deben ser al menos 0' })
    days?: number;

    @ApiPropertyOptional({
        description: 'Fecha de pago',
        example: new Date(),
        type: Date
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de pago debe ser una fecha válida' })
    @Type(() => Date)
    paidDate?: Date;

    @ApiPropertyOptional({
        description: 'Fecha de vencimiento',
        example: new Date(),
        type: Date
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de vencimiento debe ser una fecha válida' })
    @Type(() => Date)
    dueDate?: Date;

    @ApiPropertyOptional({
        description: `ID del plan de recarga.
        Validaciones:
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID del plan de recarga debe ser un número entero' })
    @Min(1, { message: 'El ID del plan de recarga debe ser mayor a 0' })
    rechargePlanId?: number;

    @ApiPropertyOptional({
        description: `Nombre del plan.
        Validaciones:
        - Longitud máxima: 255 caracteres`,
        example: 'Plan Mensual',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'El nombre del plan debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El nombre del plan no debe exceder los 255 caracteres' })
    planName?: string;

    @ApiProperty({
        description: `ICCID (Integrated Circuit Card Identifier).
        Validaciones:
        - No puede estar vacío
        - Debe tener entre 19 y 20 dígitos
        - Solo números permitidos`,
        example: '8952140061989012345',
        maxLength: 20
    })
    @IsNotEmpty({ message: 'El ICCID es obligatorio' })
    @IsString({ message: 'El ICCID debe ser una cadena de texto' })
    @MaxLength(20, { message: 'El ICCID no debe exceder los 20 caracteres' })
    @Matches(/^[0-9]{19,20}$/, { message: 'El ICCID debe contener entre 19 y 20 dígitos numéricos' })
    iccid: string;

    @ApiPropertyOptional({
        description: `IMSI (International Mobile Subscriber Identity).
        Validaciones:
        - Debe tener 15 dígitos
        - Solo números permitidos`,
        example: '123456789012345',
        maxLength: 15
    })
    @IsOptional()
    @IsString({ message: 'El IMSI debe ser una cadena de texto' })
    @MaxLength(15, { message: 'El IMSI no debe exceder los 15 caracteres' })
    @Matches(/^[0-9]{15}$/, { message: 'El IMSI debe contener exactamente 15 dígitos numéricos' })
    imsi?: string;

    @ApiProperty({
        description: `MSISDN (número de teléfono).
        Validaciones:
        - No puede estar vacío
        - Debe tener entre 10 y 16 dígitos
        - Solo números permitidos`,
        example: '5512345678',
        maxLength: 16
    })
    @IsNotEmpty({ message: 'El MSISDN es obligatorio' })
    @IsString({ message: 'El MSISDN debe ser una cadena de texto' })
    @MaxLength(16, { message: 'El MSISDN no debe exceder los 16 caracteres' })
    @Matches(/^[0-9]{10,16}$/, { message: 'El MSISDN debe contener entre 10 y 16 dígitos numéricos' })
    msisdn: string;

    @ApiPropertyOptional({
        description: 'Fecha de activación',
        example: new Date(),
        type: Date
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de activación debe ser una fecha válida' })
    @Type(() => Date)
    activationDate?: Date;

    @ApiPropertyOptional({
        description: 'Fecha de última actualización de estado',
        example: new Date(),
        type: Date
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de última actualización debe ser una fecha válida' })
    @Type(() => Date)
    lastStatusUpdate?: Date;

    @ApiProperty({
        description: `ID del cliente.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
    @IsInt({ message: 'El ID del cliente debe ser un número entero' })
    @Min(1, { message: 'El ID del cliente debe ser mayor a 0' })
    clientId: number;

    @ApiPropertyOptional({
        description: `Indica si es la primera publicación.
        Validaciones:
        - Debe ser un valor booleano
        - Valor por defecto: false`,
        example: false,
        default: false
    })
    @IsOptional()
    @IsBoolean({ message: 'isFirstPost debe ser un valor booleano' })
    isFirstPost?: boolean = false;
}
