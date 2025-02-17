import { MigrationInterface, QueryRunner } from "typeorm";

export class EliminarTablaPagoDeClientes1234567890123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pago_de_cliente"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Aquí deberías recrear la tabla si necesitas revertir la migración
        await queryRunner.query(`
            CREATE TABLE "pago_de_cliente" (
                "id" SERIAL PRIMARY KEY,
                "idplan" integer NOT NULL,
                "idcompaniclient" integer DEFAULT 0,
                "idsim" integer NOT NULL,
                "idmexpago" integer NOT NULL,
                "createAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "IsActive" boolean DEFAULT true
            )
        `);
    }

}
