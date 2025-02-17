import { MigrationInterface, QueryRunner } from "typeorm";

export class Standardizebdtokenscamelcase1733570820130 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
           // Primero renombramos las columnas
           await queryRunner.query(`
            ALTER TABLE "tokens" 
            RENAME COLUMN "createdat" TO "createdAt";
        `);

        await queryRunner.query(`
            ALTER TABLE "tokens" 
            RENAME COLUMN "updatedat" TO "updatedAt";
        `);

        await queryRunner.query(`
            ALTER TABLE "tokens" 
            RENAME COLUMN "expiresat" TO "expiresAt";
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

            // Revertimos los cambios si es necesario
            await queryRunner.query(`
                ALTER TABLE "tokens" 
                RENAME COLUMN "createdAt" TO "createdat";
            `);
    
            await queryRunner.query(`
                ALTER TABLE "tokens" 
                RENAME COLUMN "updatedAt" TO "updatedat";
            `);
    
            await queryRunner.query(`
                ALTER TABLE "tokens" 
                RENAME COLUMN "expiresAt" TO "expiresat";
            `);
    }

}
