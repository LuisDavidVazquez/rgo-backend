import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClientIdToRechargePlanMovements1735591618666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "recharge_plan_movements" 
            ADD COLUMN "clientId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "recharge_plan_movements"
            ADD CONSTRAINT "FK_recharge_plan_movements_client" 
            FOREIGN KEY ("clientId") 
            REFERENCES "clients"("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "recharge_plan_movements" 
            DROP CONSTRAINT "FK_recharge_plan_movements_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "recharge_plan_movements" 
            DROP COLUMN "clientId"
        `);
    }

}
