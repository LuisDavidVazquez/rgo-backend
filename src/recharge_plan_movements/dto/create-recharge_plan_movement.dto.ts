import {
  IsBoolean,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDate,
  MaxLength,
  Min,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Sim } from 'src/sims/entities/sim.entity';
import { PaymentProvider } from '../payment-response.interface';
import { UserTypeEnum } from '../Enum/user-type';

export class CreateRechargePlanMovementDto {
  @ApiProperty({
    description: `ID de la SIM asociada al movimiento.
    Validaciones:
    - No puede estar vacío
    - Debe ser un número entero positivo
    - Debe existir en la tabla de SIMs`,
    example: 1,
    minimum: 1
  })
  @IsNotEmpty({ message: 'El ID de la SIM es obligatorio' })
  @IsInt({ message: 'El ID de la SIM debe ser un número entero' })
  @Min(1, { message: 'El ID de la SIM debe ser mayor a 0' })
  simId: number;

  @ApiProperty({
    description: `ID del usuario que realiza el movimiento.
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
    description: `Nombre del plan de recarga.
    Validaciones:
    - No puede estar vacío
    - Debe ser una cadena de texto
    - Debe existir en la tabla de planes`,
    example: 'Plan Mensual',
    maxLength: 255
  })
  @IsNotEmpty({ message: 'El nombre del plan es obligatorio' })
  @IsString({ message: 'El nombre del plan debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre del plan no puede exceder los 255 caracteres' })
  planName: string;

  @ApiPropertyOptional({
    description: `ID del plan de recarga.
    Validaciones:
    - Debe ser un número entero positivo
    - Debe existir en la tabla de planes`,
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt({ message: 'El ID del plan debe ser un número entero' })
  @Min(1, { message: 'El ID del plan debe ser mayor a 0' })
  rechargePlanId?: number;

  @ApiProperty({
    description: `Estado del pago.
    Validaciones:
    - No puede estar vacío
    - Valores permitidos: pending, approved, rejected, cancelled, noaprobado`,
    example: 'pending',
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'noaprobado']
  })
  @IsNotEmpty({ message: 'El estado del pago es obligatorio' })
  @IsString({ message: 'El estado del pago debe ser una cadena de texto' })
  paymentStatus: string;

  @ApiProperty({
    description: `Número de transacción.
    Validaciones:
    - No puede estar vacío
    - Debe ser único`,
    example: 'TRX-2024-001'
  })
  @IsNotEmpty({ message: 'El número de transacción es obligatorio' })
  @IsString({ message: 'El número de transacción debe ser una cadena de texto' })
  transactionNumber: string;

  @ApiProperty({
    description: `ID del pago.
    Validaciones:
    - No puede estar vacío
    - Debe ser único`,
    example: 'pi_3O4X2K2eZvKYlo2C1ghrK9Qs'
  })
  @IsNotEmpty({ message: 'El ID del pago es obligatorio' })
  @IsString({ message: 'El ID del pago debe ser una cadena de texto' })
  paymentId: string;

  @ApiPropertyOptional({
    description: `Indica si es la primera recarga.
    Validaciones:
    - Debe ser un valor booleano
    - Por defecto: false`,
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isFirstPost debe ser un valor booleano' })
  isFirstPost?: boolean = false;

  @ApiProperty({
    description: `Proveedor del pago.
    Validaciones:
    - No puede estar vacío
    - Debe ser uno de los proveedores válidos`,
    enum: ['STRIPE', 'MEXPAGO', 'PAYPAL', 'BANK_TRANSFER', 'POS'],
    example: 'STRIPE'
  })
  @IsNotEmpty({ message: 'El proveedor es obligatorio' })
  @IsString({ message: 'El proveedor debe ser una cadena de texto' })
  provider: string;

  @ApiPropertyOptional({
    description: 'ID del PaymentIntent de Stripe',
    example: 'pi_3O4X2K2eZvKYlo2C1ghrK9Qs'
  })
  @IsOptional()
  @IsString({ message: 'El ID del PaymentIntent debe ser una cadena de texto' })
  stripePaymentIntentId?: string;

  @ApiPropertyOptional({
    description: 'ID del cliente en Stripe',
    example: 'cus_1234567890'
  })
  @IsOptional()
  @IsString({ message: 'El ID del cliente de Stripe debe ser una cadena de texto' })
  stripeCustomerId?: string;

  @ApiPropertyOptional({
    description: 'Client Secret del PaymentIntent',
    example: 'pi_3O4X2K2eZvKYlo2C1ghrK9Qs_secret_87654321'
  })
  @IsOptional()
  @IsString({ message: 'El Client Secret debe ser una cadena de texto' })
  clientSecret?: string;

  @ApiPropertyOptional({
    description: 'ID del método de pago',
    example: 'pm_1234567890'
  })
  @IsOptional()
  @IsString({ message: 'El ID del método de pago debe ser una cadena de texto' })
  paymentMethodId?: string;

  @ApiPropertyOptional({
    description: `Moneda del pago.
    Validaciones:
    - Debe ser una moneda válida
    - Por defecto: mxn`,
    example: 'mxn',
    default: 'mxn'
  })
  @IsOptional()
  @IsString({ message: 'La moneda debe ser una cadena de texto' })
  currency?: string = 'mxn';

  @ApiPropertyOptional({
    description: 'Metadatos adicionales del pago',
    example: {
      customerName: 'Juan Pérez',
      customerEmail: 'juan@ejemplo.com'
    }
  })
  @IsOptional()
  @IsJSON({ message: 'Los metadatos deben ser un objeto JSON válido' })
  paymentMetadata?: any;

  @ApiPropertyOptional({
    description: `Indica si el pago ha sido reembolsado.
    Validaciones:
    - Debe ser un valor booleano
    - Por defecto: false`,
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'refunded debe ser un valor booleano' })
  refunded?: boolean = false;

  @ApiPropertyOptional({
    description: `Proveedor de pago utilizado.
    Validaciones:
    - Debe ser uno de los proveedores válidos
    - Por defecto: STRIPE`,
    enum: ['STRIPE', 'MEXPAGO', 'PAYPAL', 'BANK_TRANSFER', 'POS'],
    example: 'STRIPE',
    default: 'STRIPE'
  })
  @IsOptional()
  @IsString({ message: 'El proveedor de pago debe ser una cadena de texto' })
  paymentProvider?: string = 'STRIPE';

  @ApiPropertyOptional({
    description: `Monto del pago.
    Validaciones:
    - Debe ser un número positivo
    - Por defecto: 0`,
    example: 100.00,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0, { message: 'El monto debe ser mayor o igual a 0' })
  amount?: number = 0;

  @ApiPropertyOptional({
    description: 'Permiso asociado al movimiento',
    example: 'manage_recharges'
  })
  @IsOptional()
  @IsString({ message: 'El permiso debe ser una cadena de texto' })
  permission?: string;

  @ApiPropertyOptional({
    description: `Tipo de usuario.
    Validaciones:
    - Debe ser uno de los tipos válidos`,
    enum: UserTypeEnum,
    example: UserTypeEnum.distribuidor
  })
  @IsOptional()
  @IsEnum(UserTypeEnum, { message: 'Tipo de usuario no válido' })
  userType?: string;

  @ApiPropertyOptional({
    description: 'Array de SIMs asociadas al movimiento',
    type: [Sim]
  })
  @IsOptional()
  @IsArray({ message: 'simsarray debe ser un arreglo' })
  simsarray?: Sim[];

  @ApiPropertyOptional({
    description: 'Fecha de creación del movimiento',
    example: new Date()
  })
  @IsOptional()
  @IsDate({ message: 'La fecha de creación debe ser una fecha válida' })
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de actualización del movimiento',
    example: new Date()
  })
  @IsOptional()
  @IsDate({ message: 'La fecha de actualización debe ser una fecha válida' })
  @Type(() => Date)
  updatedAt?: Date;
}
