import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTokenDto {
    @ApiProperty({
        description: `Token de autenticación.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        
        Ejemplo:
        - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        
        Restricciones:
        - Longitud máxima: 500 caracteres
        - Debe ser un token JWT válido`,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    @IsNotEmpty({ message: 'El token es obligatorio.' })
    @IsString({ message: 'El token debe ser una cadena de texto.' })
    token: string;

    @ApiPropertyOptional({
        description: `Fecha de expiración del token.
        Validaciones:
        - Debe ser una fecha válida
        - Opcional
        
        Formato:
        - ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
        
        Ejemplo:
        - 2024-12-31T23:59:59.999Z`,
        example: '2024-12-31T23:59:59.999Z'
    })
    @IsOptional()
    @IsDate({ message: 'La fecha de expiración debe ser una fecha válida.' })
    expiresAt?: Date;
}
