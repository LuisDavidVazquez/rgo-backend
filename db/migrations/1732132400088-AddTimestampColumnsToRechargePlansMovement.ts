import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimestampColumnsToRechargePlansMovement1732132400088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Añadir updatedAt si no existe
      await queryRunner.addColumn(
        'recharge_plans_movement',
        new TableColumn({
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
        })
    );

    // También añadir createdAt si no existe
    await queryRunner.addColumn(
        'recharge_plans_movement',
        new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
        })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('recharge_plans_movement', 'updated_at');
        await queryRunner.dropColumn('recharge_plans_movement', 'created_at');
    }

}
