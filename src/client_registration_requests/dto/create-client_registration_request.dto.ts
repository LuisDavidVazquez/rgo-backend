import { IsNotEmpty, IsString, IsOptional, IsEmail, Length, Matches, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum PersonType {
    FISICA = 'FISICA',
    MORAL = 'MORAL'
}

enum RequestStatus {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    RECHAZADA = 'RECHAZADA'
}

export class CreateClientRegistrationRequestDto {
    @ApiProperty({
        description: `Nombre completo del solicitante.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Longitud máxima: 255 caracteres
        - Solo letras, espacios y acentos permitidos`,
        example: 'Juan Pérez Rodríguez'
    })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 255, { message: 'El nombre debe tener entre 2 y 255 caracteres' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    name: string;

    @ApiProperty({
        description: `Número telefónico.
        Validaciones:
        - No puede estar vacío
        - Debe ser una cadena de texto
        - Debe tener 10 dígitos
        - Solo números permitidos`,
        example: '5512345678'
    })
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos numéricos' })
    phone: string;

    @ApiProperty({
        description: `Correo electrónico.
        Validaciones:
        - No puede estar vacío
        - Debe ser un email válido
        - Longitud máxima: 255 caracteres`,
        example: 'juan.perez@ejemplo.com'
    })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
    @Length(5, 255, { message: 'El correo electrónico debe tener entre 5 y 255 caracteres' })
    email: string;

    @ApiProperty({
        description: `Contraseña.
        Validaciones:
        - No puede estar vacía
        - Debe tener al menos 8 caracteres
        - Debe incluir al menos una mayúscula, una minúscula y un número
        - Longitud máxima: 255 caracteres`,
        example: 'Abc123456'
    })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @Length(8, 255, { message: 'La contraseña debe tener entre 8 y 255 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    })
    password: string;

    @ApiPropertyOptional({
        description: `Tipo de persona.
        Validaciones:
        - Debe ser uno de los siguientes valores: FISICA, MORAL`,
        enum: PersonType,
        example: 'FISICA'
    })
    @IsOptional()
    @IsEnum(PersonType, { message: 'El tipo de persona debe ser FISICA o MORAL' })
    personType?: PersonType;

    @ApiPropertyOptional({
        description: `RFC.
        Validaciones:
        - Debe seguir el formato de RFC mexicano
        - 13 caracteres para personas físicas
        - 12 caracteres para personas morales`,
        example: 'PERJ891213ABC'
    })
    @IsOptional()
    @Matches(/^([A-ZÑ&]{3,4})(\d{6})([A-Z0-9]{3})$/, {
        message: 'El RFC debe tener un formato válido'
    })
    rfc?: string;

    @ApiPropertyOptional({
        description: `Estado de residencia.
        Validaciones:
        - Debe ser un estado válido de México
        - Solo letras y espacios permitidos`,
        example: 'Ciudad de México'
    })
    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El estado solo puede contener letras y espacios' })
    state?: string;

    @ApiPropertyOptional({
        description: `Ciudad o municipio.
        Validaciones:
        - Debe ser una ciudad o municipio válido
        - Solo letras y espacios permitidos`,
        example: 'Benito Juárez'
    })
    @IsOptional()
    @IsString({ message: 'La ciudad debe ser una cadena de texto' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'La ciudad solo puede contener letras y espacios' })
    city?: string;

    @ApiPropertyOptional({
        description: `Calle y número.
        Validaciones:
        - Debe incluir nombre de la calle y número
        - Puede incluir letras, números y caracteres especiales`,
        example: 'Av. Insurgentes Sur 1234'
    })
    @IsOptional()
    @IsString({ message: 'La calle debe ser una cadena de texto' })
    @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres' })
    street?: string;

    @ApiPropertyOptional({
        description: `Código postal.
        Validaciones:
        - Debe tener exactamente 5 dígitos
        - Solo números permitidos`,
        example: '03100'
    })
    @IsOptional()
    @Matches(/^[0-9]{5}$/, { message: 'El código postal debe contener exactamente 5 dígitos numéricos' })
    postalCode?: string;

    @ApiPropertyOptional({
        description: `Colonia o fraccionamiento.
        Validaciones:
        - Solo letras, números, espacios y caracteres básicos permitidos`,
        example: 'Col. Del Valle'
    })
    @IsOptional()
    @IsString({ message: 'El barrio debe ser una cadena de texto' })
    @Length(2, 255, { message: 'El barrio debe tener entre 2 y 255 caracteres' })
    neighborhood?: string;

    @ApiPropertyOptional({
        description: `Estado de la solicitud.
        Validaciones:
        - Debe ser uno de los siguientes valores: PENDIENTE, APROBADA, RECHAZADA
        - Valor por defecto: PENDIENTE`,
        enum: RequestStatus,
        default: 'PENDIENTE'
    })
    @IsOptional()
    @IsEnum(RequestStatus, { message: 'El estado de la solicitud debe ser PENDIENTE, APROBADA o RECHAZADA' })
    requestStatus?: RequestStatus;
}
