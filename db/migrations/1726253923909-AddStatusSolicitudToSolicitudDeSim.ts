import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStatusSolicitudToSolicitudDeSim1726253923909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'solicitud_de_sim',
            new TableColumn({
                name: 'statusSolicitud',
                type: 'varchar',
                isNullable: true, // Puedes cambiar esto a false si el campo no debe ser nulo
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('solicitud_de_sim', 'statusSolicitud');

    }

}
