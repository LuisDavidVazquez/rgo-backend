import { IsJSON, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionLogDto {
    @ApiProperty({
        description: `Acción realizada.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud mínima: 3 caracteres
        - Longitud máxima: 50 caracteres
        - Debe describir la acción realizada de forma concisa
        - Se recomienda usar formato UPPERCASE con guiones bajos`,
        example: 'CREATE_USER',
        minLength: 3,
        maxLength: 50
    })
    @IsNotEmpty({ message: 'La acción no puede estar vacía' })
    @IsString({ message: 'La acción debe ser una cadena de texto' })
    @MinLength(3, { message: 'La acción debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'La acción no puede exceder los 50 caracteres' })
    action: string;

    @ApiProperty({
        description: `Cambios realizados.
        Validaciones:
        - Debe ser un objeto JSON válido
        - Debe contener los cambios realizados en la operación
        - Se recomienda incluir valores anteriores y nuevos cuando aplique
        - Puede incluir metadatos adicionales relevantes para la acción`,
        example: {
            oldValue: { 
                name: 'John',
                email: 'john@example.com'
            },
            newValue: { 
                name: 'John Doe',
                email: 'johndoe@example.com'
            },
            metadata: {
                updatedBy: 'admin',
                timestamp: '2024-03-15T10:30:00Z'
            }
        }
    })
    @IsJSON({ message: 'Los cambios deben ser un objeto JSON válido' })
    changes: any;

    @ApiProperty({
        description: `Descripción detallada de la acción.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud mínima: 10 caracteres
        - Longitud máxima: 500 caracteres
        - Debe describir detalladamente:
          * Qué acción se realizó
          * Quién la realizó (si aplica)
          * Sobre qué recurso se realizó
          * Cualquier detalle adicional relevante`,
        example: 'El administrador (ID: 1) actualizó la información del usuario ID: 123, modificando su nombre y correo electrónico',
        minLength: 10,
        maxLength: 500
    })
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres' })
    description: string;
}