import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDistributorIdTypes1732657882375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
     // 1. Primero eliminamos la restricción de clave foránea
     await queryRunner.query(`
        ALTER TABLE sim 
        DROP CONSTRAINT IF EXISTS "sim_distributorId_fkey"
    `);
     // 2. Creamos una columna temporal
    await queryRunner.query(`
        ALTER TABLE sim 
        ADD COLUMN "distributorId_temp" varchar
    `);
     // 3. Copiamos los datos a la columna temporal
    await queryRunner.query(`
        UPDATE sim 
        SET "distributorId_temp" = "distributorId"::varchar
    `);
     // 4. Eliminamos la columna original
    await queryRunner.query(`
        ALTER TABLE sim 
        DROP COLUMN "distributorId"
    `);
     // 5. Renombramos la columna temporal
    await queryRunner.query(`
        ALTER TABLE sim 
        RENAME COLUMN "distributorId_temp" TO "distributorId"
    `);
     // 6. Limpiamos los datos
    await queryRunner.query(`
        UPDATE sim 
        SET "distributorId" = NULL 
        WHERE "distributorId" = ''
    `);
     // 7. Convertimos a integer
    await queryRunner.query(`
        ALTER TABLE sim 
        ALTER COLUMN "distributorId" TYPE integer 
        USING NULLIF("distributorId", '')::integer
    `);
     // 8. Recreamos la restricción
    await queryRunner.query(`
        ALTER TABLE sim 
        ADD CONSTRAINT "sim_distributorId_fkey" 
        FOREIGN KEY ("distributorId") 
        REFERENCES "clientes_rastreo_go"(id)
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       // Proceso inverso si es necesario
       await queryRunner.query(`
        ALTER TABLE sim 
        DROP CONSTRAINT IF EXISTS "sim_distributorId_fkey"
    `);
     await queryRunner.query(`
        ALTER TABLE sim 
        ALTER COLUMN "distributorId" TYPE varchar 
        USING "distributorId"::varchar
    `);

    }

}
