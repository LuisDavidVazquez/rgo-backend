import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSolicitudDeSim1725565049195 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "solicitud_de_sim" ("id" SERIAL NOT NULL, "clienteId" integer NOT NULL, "calle" character varying NOT NULL, "colonia" character varying NOT NULL, "codigoPostal" character varying NOT NULL, "estado" character varying NOT NULL, "municipio" character varying NOT NULL, "cantidadSimsSolicitadas" integer NOT NULL, "fechaSolicitud" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_solicitud_de_sim" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "solicitud_de_sim" ADD CONSTRAINT "FK_solicitud_de_sim_cliente" FOREIGN KEY ("clienteId") REFERENCES "clientes_rastreo_go"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solicitud_de_sim" DROP CONSTRAINT "FK_solicitud_de_sim_cliente"`);
        await queryRunner.query(`DROP TABLE "solicitud_de_sim"`);
    }

}
