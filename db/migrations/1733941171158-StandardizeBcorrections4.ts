import { MigrationInterface, QueryRunner } from "typeorm";

export class StandardizeBcorrections41733941171158 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sims" DROP CONSTRAINT "sim_rechargePlanId_fkey"`);
        await queryRunner.query(`ALTER TABLE "sims" DROP CONSTRAINT "sim_distributorId_fkey"`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sims" 
            ADD CONSTRAINT "sim_rechargePlanId_fkey" 
            FOREIGN KEY ("rechargePlanId") REFERENCES "recharge_plans"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "sims" 
            ADD CONSTRAINT "sim_distributorId_fkey" 
            FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE CASCADE
        `);
    }

}
