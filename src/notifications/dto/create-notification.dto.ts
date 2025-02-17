import { IsNotEmpty, IsNumber, IsEnum, IsString, IsOptional, IsDate, IsObject, Min, MaxLength } from 'class-validator';
import { NotificationType } from '../Enum/notification-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
    @ApiProperty({
        description: `ID del cliente que recibirá la notificación.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe existir en la tabla de clientes`,
        example: 123,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
    @IsNumber({}, { message: 'El ID del cliente debe ser un número' })
    @Min(1, { message: 'El ID del cliente debe ser mayor a 0' })
    clientId: number;

    @ApiProperty({
        description: `Tipo de notificación.
        Validaciones:
        - No puede estar vacío
        - Debe ser uno de los siguientes valores:
          * LINE_EXPIRATION - Expiración de línea
          * INVOICE_DUE - Factura pendiente
          * SIM_ASSIGNMENT - Asignación de SIM
          * ACCOUNT_UPDATE - Actualización de cuenta
          * LINE_EXPIRING_SOON - Línea próxima a expirar
          * GENERAL - Notificación general`,
        enum: NotificationType,
        example: NotificationType.GENERAL
    })
    @IsNotEmpty({ message: 'El tipo de notificación es obligatorio' })
    @IsEnum(NotificationType, { message: 'Tipo de notificación no válido' })
    type: NotificationType;

    @ApiProperty({
        description: `Mensaje de la notificación.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 500 caracteres`,
        example: 'Su línea expirará en 7 días',
        maxLength: 500
    })
    @IsNotEmpty({ message: 'El mensaje es obligatorio' })
    @IsString({ message: 'El mensaje debe ser una cadena de texto' })
    @MaxLength(500, { message: 'El mensaje no puede exceder los 500 caracteres' })
    message: string;

    @ApiPropertyOptional({
        description: `Fecha de creación.
        Validaciones:
        - Debe ser una fecha válida
        - Por defecto: fecha actual`,
        example: new Date(),
        type: Date
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de creación debe ser una fecha válida' })
    @Type(() => Date)
    createdAt?: Date;

    @ApiPropertyOptional({
        description: `Fecha de expiración.
        Validaciones:
        - Debe ser una fecha válida
        - Debe ser posterior a la fecha actual`,
        example: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
        type: Date
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de expiración debe ser una fecha válida' })
    @Type(() => Date)
    expiresAt?: Date;

    @ApiPropertyOptional({
        description: `Datos adicionales de la notificación.
        Validaciones:
        - Debe ser un objeto JSON válido
        - Puede contener información específica según el tipo de notificación`,
        example: {
            iccid: '8952140061989012345',
            expirationDate: '2024-12-31',
            clientName: 'Juan Pérez'
        },
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject({ message: 'Los datos adicionales deben ser un objeto válido' })
    data?: any;
}
