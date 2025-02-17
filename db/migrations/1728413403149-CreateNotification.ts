import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { NotificationType } from '../../src/notifications/Enum/notification-type.enum';

export class CreateNotification1728413403149 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "notification",
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
                    type: "int"
                },
                {
                    name: "type",
                    type: "enum",
                    enum: Object.values(NotificationType)
                },
                {
                    name: "message",
                    type: "varchar"
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
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notification");

    }

}
