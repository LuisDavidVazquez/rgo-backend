import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNameColumnFromClientesRastreoGo1723067774636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE clientes_rastreo_go DROP COLUMN name`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE clientes_rastreo_go ADD COLUMN name VARCHAR(255)`);

    }

}
