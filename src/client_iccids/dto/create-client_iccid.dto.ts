import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientIccid } from '../entities/client_iccid.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientIccidDto extends PartialType(ClientIccid) {
    @ApiProperty({
        description: `ICCID (Integrated Circuit Card Identifier) de la SIM.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Debe tener entre 19 y 20 caracteres numéricos
        - Debe seguir el formato estándar de ICCID`,
        example: '8952140061989012345',
        minLength: 19,
        maxLength: 20
    })
    @IsNotEmpty({ message: 'El ICCID no puede estar vacío' })
    @IsString({ message: 'El ICCID debe ser una cadena de texto' })
    @Matches(/^[0-9]{19,20}$/, { message: 'El ICCID debe contener entre 19 y 20 dígitos numéricos' })
    iccid: string;

    @ApiProperty({
        description: `Nombre de la unidad.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres
        - Puede contener letras, números y caracteres especiales`,
        example: 'Unidad GPS-001',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El nombre de la unidad no puede estar vacío' })
    @IsString({ message: 'El nombre de la unidad debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El nombre de la unidad no puede exceder los 255 caracteres' })
    unitName: string;

    @ApiPropertyOptional({
        description: `IMEI (International Mobile Equipment Identity) del dispositivo.
        Validaciones:
        - Debe ser una cadena de texto
        - Debe tener exactamente 15 dígitos numéricos
        - Debe seguir el formato estándar de IMEI`,
        example: '354123456789012',
        minLength: 15,
        maxLength: 15
    })
    @IsOptional()
    @IsString({ message: 'El IMEI debe ser una cadena de texto' })
    @Matches(/^[0-9]{15}$/, { message: 'El IMEI debe contener exactamente 15 dígitos numéricos' })
    imei?: string;

    @ApiPropertyOptional({
        description: `Información GPS del dispositivo.
        Validaciones:
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres
        - Puede incluir coordenadas u otra información de ubicación`,
        example: '19.4326,-99.1332',
        maxLength: 255
    })
    @IsOptional()
    @IsString({ message: 'La información GPS debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La información GPS no puede exceder los 255 caracteres' })
    gps: string;

    @ApiProperty({
        description: `ID del usuario asociado.
        Validaciones:
        - Debe ser un número entero positivo
        - No puede estar vacío`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del usuario no puede estar vacío' })
    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    userId: number;

    @ApiPropertyOptional({
        description: `Estado de activación del ICCID.
        Validaciones:
        - Debe ser un valor booleano
        - Valor por defecto: true`,
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado de activación debe ser un valor booleano' })
    isActive?: boolean;

    @ApiPropertyOptional({
        description: `ID de la SIM asociada.
        Validaciones:
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID de la SIM debe ser un número entero' })
    simId?: number;

    @ApiPropertyOptional({
        description: `ID del cliente asociado.
        Validaciones:
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID del cliente debe ser un número entero' })
    clientId?: number;

    @ApiProperty({
        description: `Nombre de usuario.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud mínima: 3 caracteres
        - Longitud máxima: 50 caracteres
        - Solo puede contener letras, números y guiones bajos`,
        example: 'usuario_123',
        minLength: 3,
        maxLength: 50
    })
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El nombre de usuario no puede exceder los 50 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras, números y guiones bajos' })
    username: string;

    @ApiPropertyOptional({
        description: `ID del cliente ICCID.
        Validaciones:
        - Debe ser un número entero positivo`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsNotEmpty({ message: 'El ID del cliente ICCID no puede estar vacío' })
    @IsInt({ message: 'El ID del cliente ICCID debe ser un número entero' })
    clientIccidId: number;
}