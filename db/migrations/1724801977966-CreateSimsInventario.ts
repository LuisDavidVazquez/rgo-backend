import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSimsInventario1234567890123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "sims_inventario",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "companyClient",
                    type: "int",
                },
                {
                    name: "statusId",
                    type: "int",
                },
                {
                    name: "status",
                    type: "varchar",
                },
                {
                    name: "client",
                    type: "varchar",
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "days",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "paidDate",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "dueDate",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "rechargePlanId",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "planName",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "iccid",
                    type: "varchar",
                    length: "20",
                    isUnique: true
                },
                {
                    name: "imsi",
                    type: "varchar",
                    length: "15",
                    isNullable: true
                },
                {
                    name: "msisdn",
                    type: "varchar",
                    length: "16"
                },
                {
                    name: "activationDate",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "lastStatusUpdate",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                },
                {
                    name: "distributorId",
                    type: "int"
                },
                {
                    name: "isFirstPost",
                    type: "boolean",
                    default: false
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("sims_inventario");
    }
}
