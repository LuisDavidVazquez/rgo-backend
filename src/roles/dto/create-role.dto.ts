import { IsInt, IsNotEmpty, IsString, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        description: `Nombre del rol.
        Validaciones:
        - Longitud mínima: 3 caracteres
        - Longitud máxima: 50 caracteres
        - No puede estar vacío
        - Solo letras, números y guiones

        Ejemplos válidos:
        - admin
        - super-admin
        - user-manager
        
        Ejemplos inválidos:
        - a (muy corto)
        - admin@123 (caracteres especiales no permitidos)
        - un_nombre_demasiado_largo_que_excede_el_limite`,
        example: 'admin'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;

    @ApiProperty({
        description: `ID del permiso asociado al rol.
        Validaciones:
        - Debe ser un número entero positivo
        - Mayor a 0
        
        Restricciones:
        - Integridad referencial con tabla Permissions
        - Se validará existencia antes de crear/actualizar`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    permissionId: number;
}
