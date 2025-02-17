import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteNotificationTable1732656127547 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "notification" CASCADE`);
       

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
