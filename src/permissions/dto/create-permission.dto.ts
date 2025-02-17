import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({
        description: `Nombre del permiso.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres
        - Solo letras, números, espacios y guiones bajos permitidos
        - Debe ser descriptivo del permiso`,
        example: 'GESTIONAR_USUARIOS',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El nombre del permiso es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
    @Matches(/^[A-Z][A-Z0-9_]*$/, {
        message: 'El nombre debe estar en mayúsculas y solo puede contener letras, números y guiones bajos'
    })
    name: string;

    @ApiProperty({
        description: `Valor del permiso.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres
        - Representa el identificador único del permiso en el sistema`,
        example: 'manage_users',
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El valor del permiso es obligatorio' })
    @IsString({ message: 'El valor debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El valor no puede exceder los 255 caracteres' })
    @Matches(/^[a-z][a-z0-9_]*$/, {
        message: 'El valor debe estar en minúsculas y solo puede contener letras, números y guiones bajos'
    })
    value: string;

    @ApiPropertyOptional({
        description: `ID del rol asociado.
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de roles
        - Opcional: permite crear permisos sin asociación inicial a un rol`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID del rol debe ser un número entero' })
    @Min(1, { message: 'El ID del rol debe ser mayor a 0' })
    roleId?: number;
}
