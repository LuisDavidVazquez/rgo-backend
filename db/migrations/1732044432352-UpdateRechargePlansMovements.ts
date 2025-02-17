import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateRechargePlansMovements1732044432352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
   // Verificar si la tabla existe
   const tableExists = await queryRunner.hasTable('recharge_plans_movement');
   if (!tableExists) {
       throw new Error('La tabla recharge_plans_movements no existe');
   }

   // Agregar nuevas columnas
   await queryRunner.addColumns('recharge_plans_movement', [
       new TableColumn({
           name: "stripePaymentIntentId",
           type: "varchar",
           isNullable: true,
           isUnique: true
       }),
       new TableColumn({
           name: "stripeCustomerId",
           type: "varchar",
           isNullable: true
       }),
       new TableColumn({
           name: "clientSecret",
           type: "varchar",
           isNullable: true
       }),
       new TableColumn({
           name: "paymentMethodId",
           type: "varchar",
           isNullable: true
       }),
       new TableColumn({
           name: "currency",
           type: "varchar",
           default: "'mxn'"
       }),
       new TableColumn({
           name: "paymentMetadata",
           type: "jsonb",
           isNullable: true
       }),
       new TableColumn({
           name: "refunded",
           type: "boolean",
           default: false
       }),
       new TableColumn({
           name: "paymentProvider",
           type: "varchar",
           default: "'STRIPE'"
       })
   ]);
}


    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columnas
        await queryRunner.dropColumns('recharge_plans_movement', [
            "stripePaymentIntentId",
            "stripeCustomerId",
            "clientSecret",
            "paymentMethodId",
            "currency",
            "paymentMetadata",
            "refunded",
            "paymentProvider"
        ]);
    
    }

}
