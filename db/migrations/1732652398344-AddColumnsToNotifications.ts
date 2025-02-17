import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddColumnsToNotifications1732652398344 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
          // Primero creamos el tipo enum si no existe
       await queryRunner.query(`
        DO $$ BEGIN
            CREATE TYPE notification_type AS ENUM (
                'LINE_EXPIRATION',
                'INVOICE_DUE',
                'SIM_ASSIGNMENT',
                'ACCOUNT_UPDATE',
                'LINE_EXPIRING_SOON',
                'GENERAL'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    `);
     // Luego verificamos si la tabla existe y si no, la creamos
    const tableExists = await queryRunner.hasTable('notifications');
    if (!tableExists) {
        await queryRunner.createTable(new Table({
            name: "notifications",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "clientId",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "message",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "type",
                    type: "notification_type",
                    isNullable: false,
                    default: "'GENERAL'"
                },
                {
                    name: "status",
                    type: "varchar",
                    isNullable: false,
                    default: "'PENDING'"
                },
                {
                    name: "iccid",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "readAt",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "expiresAt",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "data",
                    type: "json",
                    isNullable: true
                }
            ]
        }), true);
    }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notifications");
        await queryRunner.query(`DROP TYPE IF EXISTS notification_type`);
    }

}
