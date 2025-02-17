import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSimIdColumn1723140551833 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sim" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sim" ALTER COLUMN "id" TYPE integer`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS sim_id_seq OWNED BY sim.id`);
        await queryRunner.query(`ALTER TABLE "sim" ALTER COLUMN "id" SET DEFAULT nextval('sim_id_seq')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sim" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS sim_id_seq`);
        await queryRunner.query(`ALTER TABLE "sim" ALTER COLUMN "id" TYPE integer`);
    }

}
