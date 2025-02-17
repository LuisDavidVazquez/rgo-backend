import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAmountColumnToRechargePlansMovement1732131661402 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'recharge_plans_movement',
            new TableColumn({
                name: 'amount',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: false,
                default: 0
                })
            );
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('recharge_plans_movement', 'amount');
    }

}
