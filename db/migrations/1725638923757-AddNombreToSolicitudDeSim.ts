import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNombreToSolicitudDeSim1725638923757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solicitud_de_sim" ADD COLUMN "nombre" character varying`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solicitud_de_sim" DROP COLUMN "nombre"`);

    }

}
