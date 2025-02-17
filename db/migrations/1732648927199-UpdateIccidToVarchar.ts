import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIccidToVarchar1732648927199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Consulta de debug para ver todas las tablas
        const tables = await queryRunner.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
`);
        console.log('Tablas disponibles:', tables);
        // Verificar si la tabla existe antes de proceder
        const tableExists = await queryRunner.query(`
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sim'
    );
`);
        console.log('¿La tabla existe?:', tableExists);
        // Resto de tu código de migración...
        await queryRunner.query(`
    DO $$ BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'UQ_sim_iccid'
        ) THEN
            ALTER TABLE "sim" DROP CONSTRAINT UQ_sim_iccid;
        END IF;
    END $$;
`);
        await queryRunner.query(`
    ALTER TABLE "sim" 
    ALTER COLUMN iccid TYPE VARCHAR 
    USING iccid::VARCHAR;
`);
        await queryRunner.query(`
    ALTER TABLE "sim" 
    ADD CONSTRAINT UQ_sim_iccid UNIQUE (iccid);
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sim" 
            DROP CONSTRAINT UQ_sim_iccid;
        `);
         await queryRunner.query(`
            ALTER TABLE "sim" 
            ALTER COLUMN iccid TYPE INTEGER 
            USING (iccid::INTEGER);
        `);
         await queryRunner.query(`
            ALTER TABLE "sim" 
            ADD CONSTRAINT UQ_sim_iccid UNIQUE (iccid);
        `);
    }

}
