import { MigrationInterface, QueryRunner } from "typeorm";

export class Relaciones1722626109766 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "permission" ADD FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE SET NULL ON UPDATE CASCADE;`);

        await queryRunner.query(`ALTER TABLE "role" ADD FOREIGN KEY ("permissionId") REFERENCES "permission" ("id");`);

        await queryRunner.query(`ALTER TABLE "user" ADD FOREIGN KEY ("clienteRastreoGoId") REFERENCES "clientes_rastreo_go" ("id") ON DELETE SET NULL;`);

        await queryRunner.query(`ALTER TABLE "clientes_rastreo_go" ADD FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL;`);

        await queryRunner.query(`ALTER TABLE "sim" ADD FOREIGN KEY ("rechargePlanId") REFERENCES "recharge_plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
        await queryRunner.query(`ALTER TABLE "sim" ADD FOREIGN KEY ("distributorId") REFERENCES "clientes_rastreo_go" ("id") ON DELETE CASCADE;`);

        await queryRunner.query(`ALTER TABLE "cliente_iccid" ADD FOREIGN KEY ("userId") REFERENCES "user" ("id");`);
        await queryRunner.query(`ALTER TABLE "cliente_iccid" ADD FOREIGN KEY ("simId") REFERENCES "sim" ("id") ON DELETE SET NULL ON UPDATE CASCADE;`);

        await queryRunner.query(`ALTER TABLE "comisione" ADD FOREIGN KEY ("reportcomisioneId") REFERENCES "reportcomisione" ("id");`);
        await queryRunner.query(`ALTER TABLE "comisione" ADD FOREIGN KEY ("rechargePlansMovementId") REFERENCES "recharge_plans_movement" ("id") ON DELETE CASCADE;`);

        await queryRunner.query(`ALTER TABLE "recharge_plans_movement" ADD FOREIGN KEY ("simId") REFERENCES "sim" ("id") ON DELETE CASCADE;`);
        await queryRunner.query(`ALTER TABLE "recharge_plans_movement" ADD FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE;`);
        await queryRunner.query(`ALTER TABLE "recharge_plans_movement" ADD FOREIGN KEY ("rechargePlanId") REFERENCES "recharge_plan" ("id") ON DELETE CASCADE;`);

        await queryRunner.query(`ALTER TABLE "user_role" ADD FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD FOREIGN KEY ("clientId") REFERENCES "clientes_rastreo_go" ("id") ON DELETE SET NULL;`);

        await queryRunner.query(`ALTER TABLE "sim_cliente_iccid" ADD FOREIGN KEY ("cliente_iccid_id") REFERENCES "cliente_iccid" ("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        await queryRunner.query(`ALTER TABLE "sim_cliente_iccid" ADD FOREIGN KEY ("sim_id") REFERENCES "sim" ("id") ON DELETE CASCADE ON UPDATE CASCADE;`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP FOREIGN KEY "permission_roleId_fkey";`);
        await queryRunner.query(`ALTER TABLE "role" DROP FOREIGN KEY "role_permissionId_fkey";`);
    }

}
