import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSim1730743749905 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
           // Modificar la columna statusId para permitir NULL
           await queryRunner.query(`
            ALTER TABLE "sim" 
            ALTER COLUMN "statusId" DROP NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
                // Revertir los cambios
                await queryRunner.query(`
                    ALTER TABLE "sim" 
                    ALTER COLUMN "statusId" SET NOT NULL;
                `);
    }

}
