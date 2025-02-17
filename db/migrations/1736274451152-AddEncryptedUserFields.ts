import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEncryptedUserFields1736274451152 implements MigrationInterface {
  name = 'AddEncryptedUserFields1736274451152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new encrypted columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "encryptedUsername" varchar(255),
      ADD COLUMN "encryptedEmail" varchar(255),
      ADD COLUMN "encryptedPhone" varchar(255)
    `);

    // Copy existing data to encrypted columns (will be encrypted by the application)
    await queryRunner.query(`
      UPDATE "users"
      SET "encryptedUsername" = username,
          "encryptedEmail" = email,
          "encryptedPhone" = phone
    `);

    // Drop old columns
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "username",
      DROP COLUMN "email",
      DROP COLUMN "phone"
    `);

    // Rename encrypted columns to original names
    await queryRunner.query(`
      ALTER TABLE "users"
      RENAME COLUMN "encryptedUsername" TO "username",
      RENAME COLUMN "encryptedEmail" TO "email",
      RENAME COLUMN "encryptedPhone" TO "phone"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Since we're just changing the content format of the columns
    // and not their names, we don't need to do anything in the down migration
    // The data will just be in encrypted format
  }
}
