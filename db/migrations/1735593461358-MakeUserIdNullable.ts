import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserIdNullable1735593461358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "recharge_plan_movements" 
            ALTER COLUMN "userId" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "recharge_plan_movements" 
            ALTER COLUMN "userId" SET NOT NULL
        `);
    }

}
