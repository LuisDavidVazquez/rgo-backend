import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSimDto {
    @ApiProperty({
        description: `ID de la SIM.
        Validaciones:
        - Debe ser un número entero positivo
        - No puede estar vacío`,
        example: 123456
    })
    @IsNumber()
    id: number;

    @ApiPropertyOptional({
        description: `Estado de la SIM.
        Validaciones:
        - Debe ser una cadena de texto
        - Estados válidos: "Activa", "Suspendida", "Inventario", "Eliminada"`,
        example: "Activa"
    })
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty({
        description: `ICCID de la SIM.
        Validaciones:
        - Debe ser una cadena de texto
        - Formato: 19-20 dígitos numéricos
        - No puede estar vacío`,
        example: "8952140061234567890"
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{19,20}$/, { message: 'ICCID debe tener 19-20 dígitos numéricos' })
    iccid: string;

    @ApiPropertyOptional({
        description: `ID del cliente (distribuidor).
        Validaciones:
        - Debe ser un número entero positivo
        - Debe existir en la tabla de clientes`,
        example: 12345
    })
    @IsOptional()
    @IsNumber()
    clientId?: number;

    @IsOptional()
    @IsString()
    client: string;

    @IsOptional()
    @IsString()
    name: string;//notificar a QUASSAR 

    @IsOptional()
    @IsString()
    unitName: string;

    @IsOptional()
    @IsNumber()
    days: number;

    @IsOptional()
    @IsDate()
    paidDate: Date; //fecha en que se pago el sim

    @IsOptional()
    @IsDate()
    dueDate: Date; // fecha vencimiento del sim

    @IsOptional()
    @IsNumber()
    rechargePlanId: number;

    @IsOptional()
    @IsString()
    planName: string;

    @IsOptional()
    @IsString()
    imsi: string;

    @IsOptional()
    @IsString()
    msisdn: string;

    @IsOptional()
    @IsDate()
    activationDate?: Date;

    @IsOptional()
    @IsDate()
    lastStatusUpdate?: Date;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;

    //    @IsBoolean()
    //    @IsOptional()
    //   isFirstPost?: boolean;
    @IsOptional()
    @IsNumber()
    companyClient?: number;

    @IsOptional()
    @IsString()
    serviceName: string;

    @IsOptional()
    @IsNumber()
    coveragePlan: number;

    // Opcional: si quieres permitir que el status sea especificado
    @IsOptional()
    @IsNumber()
    statusId?: number;
}