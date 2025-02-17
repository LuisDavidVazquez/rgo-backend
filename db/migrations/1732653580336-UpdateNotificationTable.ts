import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationTable1732653580336 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Primero respaldamos los datos existentes en una columna temporal
        await queryRunner.query(`
    ALTER TABLE "sim" 
    ADD COLUMN temp_iccid VARCHAR(20);
`);
        // 2. Copiamos los datos válidos
        await queryRunner.query(`
    UPDATE "sim"
    SET temp_iccid = CASE 
        WHEN iccid = '' THEN NULL 
        ELSE iccid 
    END;
`);
        // 3. Eliminamos la columna original
        await queryRunner.query(`
    ALTER TABLE "sim" 
    DROP COLUMN iccid;
`);
        // 4. Renombramos la columna temporal
        await queryRunner.query(`
    ALTER TABLE "sim" 
    RENAME COLUMN temp_iccid TO iccid;
`);
        // 5. Añadimos la restricción UNIQUE
        await queryRunner.query(`
    ALTER TABLE "sim"
        ADD CONSTRAINT "UQ_sim_iccid" UNIQUE (iccid);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir los cambios
    await queryRunner.query(`
        ALTER TABLE "sim" 
        DROP CONSTRAINT IF EXISTS "UQ_sim_iccid";
    `);
    }

}
