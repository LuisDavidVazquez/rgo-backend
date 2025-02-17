import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRoleDto {
    @ApiPropertyOptional({
        description: `ID del usuario.
        Validaciones:
        - Debe ser un número entero positivo
        - Mayor a 0
        
        Restricciones:
        - Integridad referencial con tabla Users
        - Se validará existencia antes de crear/actualizar`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    userId?: number;

    @ApiPropertyOptional({
        description: `ID del cliente.
        Validaciones:
        - Debe ser un número entero positivo
        - Mayor a 0
        
        Restricciones:
        - Integridad referencial con tabla Clients
        - Se validará existencia antes de crear/actualizar`,
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    clientId?: number;

    @ApiProperty({
        description: `Tipo de rol.
        Validaciones:
        - Longitud mínima: 3 caracteres
        - Longitud máxima: 50 caracteres
        - Solo letras, guiones y guiones bajos
        - No puede estar vacío
        
        Ejemplos válidos:
        - admin
        - super-admin
        - user_manager
        
        Ejemplos inválidos:
        - a (muy corto)
        - admin@123 (caracteres especiales no permitidos)
        - 123 (solo números)`,
        example: 'admin'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    @Matches(/^[a-zA-Z-_]+$/, {
        message: 'roleType solo puede contener letras, guiones y guiones bajos'
    })
    roleType: string;

    @ApiProperty({
        description: `ID del rol.
        Validaciones:
        - Debe ser un número entero positivo
        - Mayor a 0
        
        Restricciones:
        - Integridad referencial con tabla Roles
        - Se validará existencia antes de crear/actualizar`,
        example: 1,
        minimum: 1
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    roleId: number;
}
