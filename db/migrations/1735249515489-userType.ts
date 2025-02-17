import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UserType1735249515489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('recharge_plan_movements', new TableColumn({
            name: 'userType',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
               // Eliminar la columna userType de la tabla recharge_plan_movements
               await queryRunner.dropColumn('recharge_plan_movements', 'userType');

             
    }

}
