import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class StandardizeBcorrections31733265086479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey('fiscal_data', 'fk_fiscal_data_client');


        await queryRunner.renameTable('fiscal_data', 'fiscal_details');


        await queryRunner.createForeignKey('fiscal_details', new TableForeignKey({
            name: 'fk_fiscal_details_client',
            columnNames: ['clientId'],
            referencedTableName: 'clients',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
        }));



    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
