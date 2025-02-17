import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCompanyClientColumn1723043823757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sim" RENAME COLUMN "CompanyClient" TO "companyClient";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
