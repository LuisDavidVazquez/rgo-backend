import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserColumnLengths1733000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Aumentar la longitud de las columnas en la tabla users
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "username" TYPE VARCHAR(512),
            ALTER COLUMN "email" TYPE VARCHAR(512),
            ALTER COLUMN "password" TYPE VARCHAR(512),
            ALTER COLUMN "phone" TYPE VARCHAR(512),
            ALTER COLUMN "permission" TYPE VARCHAR(512),
            ALTER COLUMN "externalId" TYPE VARCHAR(512);
        `);

        // También actualizar la tabla clientes_rastreo_go por si acaso
        await queryRunner.query(`
            ALTER TABLE "clientes_rastreo_go" 
            ALTER COLUMN "username" TYPE VARCHAR(512),
            ALTER COLUMN "email" TYPE VARCHAR(512),
            ALTER COLUMN "password" TYPE VARCHAR(512),
            ALTER COLUMN "phone" TYPE VARCHAR(512),
            ALTER COLUMN "permission" TYPE VARCHAR(512),
            ALTER COLUMN "externalId" TYPE VARCHAR(512);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir los cambios si es necesario
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "username" TYPE VARCHAR(255),
            ALTER COLUMN "email" TYPE VARCHAR(255),
            ALTER COLUMN "password" TYPE VARCHAR(255),
            ALTER COLUMN "phone" TYPE VARCHAR(255),
            ALTER COLUMN "permission" TYPE VARCHAR(255),
            ALTER COLUMN "externalId" TYPE VARCHAR(255);
        `);

        await queryRunner.query(`
            ALTER TABLE "clientes_rastreo_go" 
            ALTER COLUMN "username" TYPE VARCHAR(255),
            ALTER COLUMN "email" TYPE VARCHAR(255),
            ALTER COLUMN "password" TYPE VARCHAR(255),
            ALTER COLUMN "phone" TYPE VARCHAR(255),
            ALTER COLUMN "permission" TYPE VARCHAR(255),
            ALTER COLUMN "externalId" TYPE VARCHAR(255);
        `);
    }
} 