import { IsBoolean, IsInt, IsNotEmpty, IsString, IsEmail, IsOptional, Matches, Min, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum NotificationType {
    ALERT = 'ALERT',
    UPDATE = 'UPDATE',
    SYSTEM = 'SYSTEM',
    MAINTENANCE = 'MAINTENANCE',
    REPORT = 'REPORT'
}

export class CreateNotificationPreferenceDto {
    @ApiProperty({
        description: `ID del usuario.
        Validaciones:
        - No puede estar vacío
        - Debe ser un número entero positivo
        - Debe existir en la tabla de usuarios`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
    userId: number;

    @ApiProperty({
        description: `Tipo de notificación.
        Validaciones:
        - No puede estar vacío
        - Debe ser uno de los siguientes valores: ALERT, UPDATE, SYSTEM, MAINTENANCE, REPORT`,
        enum: NotificationType,
        example: 'ALERT'
    })
    @IsNotEmpty({ message: 'El tipo de notificación es obligatorio' })
    @IsEnum(NotificationType, { message: 'Tipo de notificación no válido' })
    notificationType: string;

    @ApiProperty({
        description: `Recibir notificaciones por correo electrónico.
        Validaciones:
        - No puede estar vacío
        - Debe ser un valor booleano
        - Valor por defecto: false`,
        example: false,
        default: false
    })
    @IsNotEmpty({ message: 'La preferencia de email es obligatoria' })
    @IsBoolean({ message: 'La preferencia de email debe ser un valor booleano' })
    email: boolean = false;

    @ApiProperty({
        description: `Recibir notificaciones por SMS.
        Validaciones:
        - No puede estar vacío
        - Debe ser un valor booleano
        - Valor por defecto: false`,
        example: false,
        default: false
    })
    @IsNotEmpty({ message: 'La preferencia de SMS es obligatoria' })
    @IsBoolean({ message: 'La preferencia de SMS debe ser un valor booleano' })
    sms: boolean = false;

    @ApiProperty({
        description: `Recibir notificaciones en el portal.
        Validaciones:
        - No puede estar vacío
        - Debe ser un valor booleano
        - Valor por defecto: true`,
        example: true,
        default: true
    })
    @IsNotEmpty({ message: 'La preferencia de portal es obligatoria' })
    @IsBoolean({ message: 'La preferencia de portal debe ser un valor booleano' })
    portal: boolean = true;

    @ApiPropertyOptional({
        description: `Dirección de correo electrónico para notificaciones.
        Validaciones:
        - Debe ser un email válido
        - Requerido si email está activado
        - Máximo 255 caracteres`,
        example: 'usuario@ejemplo.com',
        maxLength: 255
    })
    @IsOptional()
    @IsEmail({}, { message: 'Debe proporcionar un email válido' })
    @MaxLength(255, { message: 'El email no puede exceder los 255 caracteres' })
    emailAddress?: string;

    @ApiPropertyOptional({
        description: `Número telefónico para SMS.
        Validaciones:
        - Debe ser un número telefónico válido (10 dígitos)
        - Requerido si SMS está activado`,
        example: '5512345678'
    })
    @IsOptional()
    @Matches(/^[0-9]{10}$/, { message: 'El número telefónico debe contener 10 dígitos' })
    phoneNumber?: string;

    @ApiPropertyOptional({
        description: `Estado de lectura de la notificación.
        Validaciones:
        - Debe ser un valor booleano
        - Valor por defecto: false`,
        example: false,
        default: false
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado de lectura debe ser un valor booleano' })
    read?: boolean = false;
}
