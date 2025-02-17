import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class CreateUserDto {
    
    @ApiProperty({
        description: `Nombre de usuario del sistema.
        Validaciones:
        - Longitud mínima: 4 caracteres
        - Longitud máxima: 50 caracteres
        - Solo permite: letras, números, puntos, guiones bajos y guiones medios
        - No puede estar vacío
        
        Ejemplos válidos:
        - john.doe
        - user_123
        - admin-2024
        
        Ejemplos inválidos:
        - jo (muy corto)
        - user@123 (carácter especial no permitido)
        - user space (espacios no permitidos)`,
        example: 'john.doe2024'
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiPropertyOptional({
        description: `Nivel de cliente en el sistema.
        Validaciones:
        - Debe ser uno de los siguientes valores: ['1', '2', '3']
        - Opcional, valor por defecto: '3'
        
        Niveles:
        1: Nivel Administrador - Acceso total al sistema
        2: Nivel Distribuidor - Gestión de inventario y ventas
        3: Nivel Usuario Regular - Funcionalidades básicas`,
        example: '2',
        enum: ['1', '2', '3'],
        default: '3'
    })
    @IsOptional()
    @IsString()
    clientLevel?: string;

    @ApiProperty({
        description: `Número telefónico.
        Validaciones:
        - Formato internacional E.164
        - Debe incluir código de país
        - Solo números, sin espacios
        - Longitud: 10-15 dígitos (incluyendo código de país)
        
        Ejemplos válidos:
        - +525512345678
        - +18001234567
        
        Ejemplos inválidos:
        - 5512345678 (falta código de país)
        - +52 55 1234 5678 (contiene espacios)`,
        example: '+525512345678'
    })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({
        description: `Correo electrónico.
        Validaciones:
        - Formato válido de email
        - No puede estar vacío
        - Sensible a mayúsculas/minúsculas
        
        Ejemplos válidos:
        - usuario@dominio.com
        - nombre.apellido@empresa.com.mx
        
        Ejemplos inválidos:
        - usuario@dominio (falta TLD)
        - usuario.com (falta @)
        - @dominio.com (falta usuario)`,
        example: 'john.doe@empresa.com.mx'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiPropertyOptional({
        description: `Contraseña del usuario.
        Validaciones:
        - Mínimo 8 caracteres
        - Debe contener al menos:
          * Una letra mayúscula
          * Una letra minúscula
          * Un número
          * Un carácter especial
        
        Ejemplos válidos:
        - SecurePass2024!
        - Abcd1234#
        
        Ejemplos inválidos:
        - pass123 (muy corta)
        - Password (falta número y carácter especial)
        - 12345678 (faltan letras y carácter especial)`,
        example: 'SecurePass2024!'
    })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiPropertyOptional({
        description: 'ID externo para integración con otros sistemas',
        example: 'EXT_USER_123456',
        type: String,
        pattern: '^EXT_USER_\\d{6}$'
    })
    @IsOptional()
    @IsString()
    externalId?: string;

    @ApiProperty({
        description: `Nivel de permisos.
        Validaciones:
        - Debe ser uno de: ['admin', 'distributor', 'user']
        - No puede estar vacío
        
        Permisos:
        - admin: Acceso total al sistema
        - distributor: Acceso a gestión de distribución
        - user: Acceso básico`,
        example: 'distributor',
        enum: ['admin', 'distributor', 'user']
    })
    @IsNotEmpty()
    @IsString()
    permission: string;

    @ApiPropertyOptional({
        description: 'Estado de activación del usuario',
        example: true,
        default: true,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @ApiPropertyOptional({
        description: 'Fecha de último acceso al sistema',
        example: '2024-03-15T14:30:00Z',
        type: Date
    })
    @IsOptional()
    @IsInt()
    externalPlatformId?: number;

    @ApiPropertyOptional({
        description: `ID de cliente.
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de clientes
        - Mayor a 0
        
        Restricciones:
        - Integridad referencial con tabla Clients
        - Se validará existencia antes de crear/actualizar`,
        example: 98765,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    clientId?: number;
}
