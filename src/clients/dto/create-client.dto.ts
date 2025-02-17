import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsInt, Matches, Length, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


//export class fiscalDetailDTO {
//    @IsString()
//    personType: string;//fisica o moral
//    @IsString()
//    rfc: string;
    
//    @IsString()
//    businessName?: string;
//    @IsString()
//    fiscalRegime?: string;
//    @IsString()
//    cdfiUsage?: string;
//    @IsString()
//    paymentMethod?: string;
//    @IsString()
//    paymentForm?: string;
//    @IsString()
//    paymentCurrency?: string;


//}

//export class addressDTO {
//    @IsString()
//    state: string;
//    @IsString()
//    city: string;
//    @IsString()
//    street: string;
//    @IsString()
//    postalCode: string;
//    @IsString()
//    neighborhood?: string;
//    @IsString()
//    country?: string;
//    @IsString()
//    innerNumber?: string;
//    @IsString()
//    externalNumber?: string;
//    @IsBoolean()
//    isFiscalData?: boolean;
//}

export class CreateClientDto {
    @ApiProperty({
        description: `Nombre completo del cliente.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud mínima: 3 caracteres
        - Longitud máxima: 255 caracteres
        - Solo letras, espacios y acentos permitidos`,
        example: 'Juan Pérez Rodríguez',
        minLength: 3,
        maxLength: 255
    })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
        message: 'El nombre solo puede contener letras, espacios y acentos' 
    })
    name: string;

    @ApiPropertyOptional({
        description: `Nivel del cliente.
        Validaciones:
        - Debe ser una cadena de texto
        - Valores permitidos: '1' (SuperAdmin), '2' (Distribuidor), '4' (Ventas), '5' (Administración)
        - Valor por defecto según el tipo de usuario`,
        example: '2',
        enum: ['1', '2', '4', '5']
    })
    @IsOptional()
    @IsString({ message: 'El nivel del cliente debe ser una cadena de texto' })
    @Matches(/^[1245]$/, { 
        message: 'El nivel del cliente debe ser 1, 2, 4 o 5' 
    })
    clientLevel?: string;

    @ApiProperty({
        description: `Número telefónico.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Debe tener 10 dígitos
        - Solo números permitidos`,
        example: '5512345678'
    })
    @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @Matches(/^[0-9]{10}$/, { 
        message: 'El teléfono debe contener exactamente 10 dígitos numéricos' 
    })
    phone: string;

    @ApiProperty({
        description: `Correo electrónico.
        Validaciones:
        - No puede estar vacío
        - Debe ser un email válido
        - Longitud máxima: 255 caracteres`,
        example: 'juan.perez@ejemplo.com'
    })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
    @MaxLength(255, { message: 'El correo electrónico no puede exceder los 255 caracteres' })
    email: string;

    @ApiPropertyOptional({
        description: `Contraseña.
        Validaciones:
        - Debe tener al menos 8 caracteres
        - Debe incluir al menos una mayúscula, una minúscula y un número
        - Longitud máxima: 255 caracteres`,
        example: 'Abc123456'
    })
    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(255, { message: 'La contraseña no puede exceder los 255 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    })
    password?: string;

    @ApiPropertyOptional({
        description: `Permiso asignado al cliente.
        Validaciones:
        - Debe ser una cadena de texto
        - Se asigna automáticamente según el rol`,
        example: 'distributor_access'
    })
    @IsOptional()
    @IsString({ message: 'El permiso debe ser una cadena de texto' })
    permission?: string;

    @ApiPropertyOptional({
        description: `ID externo del cliente.
        Validaciones:
        - Debe ser una cadena de texto
        - Usado para referencias externas`,
        example: 'EXT123'
    })
    @IsOptional()
    @IsString({ message: 'El ID externo debe ser una cadena de texto' })
    externalId?: string;

    @ApiPropertyOptional({
        description: `Estado de activación del cliente.
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
        description: `ID de la plataforma externa.
        Validaciones:
        - Debe ser un número entero
        - Usado para referencias a plataformas externas`,
        example: 1
    })
    @IsOptional()
    @IsInt({ message: 'El ID de la plataforma externa debe ser un número entero' })
    externalPlatformId?: number;
}
