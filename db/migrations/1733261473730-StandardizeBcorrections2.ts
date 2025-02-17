import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class StandardizeBcorrections21733261473730 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("client_registration_requests", "tipoPersona", "personType");
        await queryRunner.renameColumn("client_registration_requests", "municipality", "city");
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "innerNumber",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "externalNumber",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "isFiscalData",
            type: "boolean",
            default: true
        }));
        await queryRunner.renameColumn("sim_requests", "colony", "neighborhood");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir renombrar las columnas a camelCase y en inglés
    
        // Tabla 'client_registration_requests'
        await queryRunner.renameColumn("client_registration_requests", "personType", "tipoPersona");
        await queryRunner.renameColumn("client_registration_requests", "city", "municipality");
    
        // Tabla 'addresses'
        await queryRunner.dropColumn("addresses", "isFiscalData");
        await queryRunner.dropColumn("addresses", "externalNumber");
        await queryRunner.dropColumn("addresses", "innerNumber");
    
        // Tabla 'sim_requests'
        await queryRunner.renameColumn("sim_requests", "neighborhood", "colony");
    }
}
