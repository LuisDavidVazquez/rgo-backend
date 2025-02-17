import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIccidToVarcharAndClean1732654963752 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            // Primero, aseguramos que la columna sea de tipo text
            await queryRunner.query(`
                ALTER TABLE "sim" 
                ALTER COLUMN iccid TYPE TEXT;
            `);
             // Limpiamos los valores vacíos
            await queryRunner.query(`
                UPDATE "sim"
                SET iccid = NULL
                WHERE iccid = '';
            `);
             // Finalmente, establecemos el tipo y restricciones finales
            await queryRunner.query(`
                ALTER TABLE "sim" 
                ALTER COLUMN iccid TYPE VARCHAR(20);
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      // La reversión simplemente mantiene la columna como VARCHAR
      await queryRunner.query(`
        ALTER TABLE "sim" 
        ALTER COLUMN iccid TYPE VARCHAR(20);
    `);
    }

}
