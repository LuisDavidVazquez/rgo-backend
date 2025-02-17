import { MigrationInterface, QueryRunner } from "typeorm";
import { Table } from "typeorm";

export class CreateNotificationPreference1728533694674 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "notification_preference",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "userId",
                    type: "int"
                },
                {
                    name: "notificationType",
                    type: "varchar"
                },
                {
                    name: "email",
                    type: "boolean",
                    default: false
                },
                {
                    name: "sms",
                    type: "boolean",
                    default: false
                },
                {
                    name: "portal",
                    type: "boolean",
                    default: true
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notification_preference");

    }

}
