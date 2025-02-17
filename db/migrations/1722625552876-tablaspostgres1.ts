import { MigrationInterface, QueryRunner } from "typeorm";

export class Tablaspostgres11722625552876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bitacora" (
            "id" SERIAL PRIMARY KEY,
            "action" VARCHAR(255) NOT NULL,
            "changes" JSONB NOT NULL,
            "description" TEXT NOT NULL,
            "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE "datos_fiscale" (
            "id" SERIAL PRIMARY KEY,
            "tipoPersona" VARCHAR(255) NOT NULL,
            "rfc" VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE "direccione" (
            "id" SERIAL PRIMARY KEY,
            "estado" VARCHAR(255) NOT NULL,
            "municipio" VARCHAR(255) NOT NULL,
            "calle" VARCHAR(255) NOT NULL,
            "codigoPostal" INTEGER NOT NULL
        );
        
        
        CREATE TABLE "recharge_plan" (
            "id" SERIAL PRIMARY KEY,
            "amount" INTEGER NOT NULL,
            "days" INTEGER NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "name" VARCHAR(255)
        );
        
        CREATE TABLE "reportcomisione" (
            "id" SERIAL PRIMARY KEY,
            "idcomisione" INTEGER NOT NULL,
            "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
        );
        
        CREATE TABLE "solicitudes" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(255) NOT NULL,
            "phone" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL,
            "password" VARCHAR(255) NOT NULL,
            "tipoPersona" VARCHAR(255) NOT NULL,
            "rfc" VARCHAR(255),
            "estado" VARCHAR(255) NOT NULL,
            "municipio" VARCHAR(255) NOT NULL,
            "calle" VARCHAR(255) NOT NULL,
            "codigoPostal" VARCHAR(5) NOT NULL
        );
        
        CREATE TABLE "token" (
            "id" SERIAL PRIMARY KEY,
            "token" VARCHAR(500) NOT NULL,
            "fechaObtencion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
      
        CREATE TABLE "permission" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "value" VARCHAR(255) NOT NULL,
            "roleId" INTEGER
        );
        
        CREATE TABLE "role" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "permissionId" INTEGER NOT NULL
        );
        
        CREATE TABLE "user" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(255) NOT NULL,
            "clientlevel" VARCHAR(255),
            "phone" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255),
            "externalId" VARCHAR(255),
            "permission" VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
            "externalPlatformId" INTEGER,
            "idPadre" INTEGER NOT NULL,
            "clienteRastreoGoId" INTEGER
        );
        
        CREATE TABLE "clientes_rastreo_go" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(255) NOT NULL,
            "clientlevel" VARCHAR(255),
            "phone" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255),
            "permission" VARCHAR(255),
            "externalId" VARCHAR(255),
            "userId" INTEGER,
            "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
            "externalPlatformId" INTEGER,
            "datosFiscalesId" INTEGER,
            "direccionId" INTEGER,
            "name" VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE "sim" (
            "id" SERIAL PRIMARY KEY,
            "statusId" INTEGER NOT NULL,
            "client" VARCHAR(255) NOT NULL,
            "name" VARCHAR(255),
            "days" INTEGER,
            "paidDate" TIMESTAMP,
            "dueDate" TIMESTAMP,
            "rechargePlanId" INTEGER,
            "planName" VARCHAR(255),
            "iccid" VARCHAR(20) NOT NULL UNIQUE,
            "imsi" VARCHAR(15),
            "msisdn" VARCHAR(16) NOT NULL,
            "activationDate" TIMESTAMP,
            "lastStatusUpdate" TIMESTAMP,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "status" VARCHAR(255),
            "distributorId" INTEGER,
            "isFirstPost" BOOLEAN NOT NULL DEFAULT FALSE,
            "CompanyClient" INTEGER
        );
        
        CREATE TABLE "cliente_iccid" (
            "id" SERIAL PRIMARY KEY,
            "iccid" VARCHAR(255) NOT NULL UNIQUE,
            "unitname" VARCHAR(255) NOT NULL,
            "imei" VARCHAR(255) NOT NULL,
            "gps" VARCHAR(255) NOT NULL,
            "userId" INTEGER NOT NULL,
            "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
            "simId" INTEGER,
            "distributorId" INTEGER
        );
        
        CREATE TABLE "comisione" (
            "id" SERIAL PRIMARY KEY,
            "idcompaniclient" INTEGER NOT NULL,
            "recarga" INTEGER NOT NULL,
            "comision" INTEGER NOT NULL,
            "createAt" TIMESTAMP NOT NULL,
            "updateAt" TIMESTAMP NOT NULL,
            "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
            "reportcomisioneId" INTEGER,
            "rechargePlansMovementId" INTEGER,
            "activacion" INTEGER
        );
        
        CREATE TABLE "recharge_plans_movement" (
            "id" SERIAL PRIMARY KEY,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "UpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "simId" INTEGER NOT NULL,
            "userId" INTEGER NOT NULL,
            "planName" VARCHAR(255) NOT NULL,
            "rechargePlanId" INTEGER,
            "statusPago" VARCHAR(255) NOT NULL,
            "transactionNumber" VARCHAR(255) NOT NULL,
            "paymentId" VARCHAR(255) NOT NULL,
            "isFirstPost" BOOLEAN NOT NULL DEFAULT FALSE
        );
        
        CREATE TABLE "user_role" (
            "id" SERIAL PRIMARY KEY,
            "userId" INTEGER,
            "clientId" INTEGER,
            "roleType" VARCHAR(255) NOT NULL,
            "roleId" INTEGER NOT NULL
        );
        
        CREATE TABLE "sim_cliente_iccid" (
            "sim_id" INTEGER NOT NULL,
            "cliente_iccid_id" INTEGER NOT NULL,
            PRIMARY KEY ("sim_id", "cliente_iccid_id")
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bitacora"`);
        await queryRunner.query(`DROP TABLE "datos_fiscale"`);
        await queryRunner.query(`DROP TABLE "direccione"`);
        await queryRunner.query(`DROP TABLE "pago_de_cliente"`);
        await queryRunner.query(`DROP TABLE "recharge_plan"`);
        await queryRunner.query(`DROP TABLE "reportcomisione"`);
        await queryRunner.query(`DROP TABLE "solicitudes"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
