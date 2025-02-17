import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class StandardizeBcorrections1733248248575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.dropColumn("addresses", "municipio");
        await queryRunner.renameColumn("addresses", "estado", "state");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("fiscal_data", "tipoPersona", "personType");

        await queryRunner.dropForeignKey("users", "fk_users_parent");
        await queryRunner.dropColumn("users", "parentId");


        await queryRunner.dropForeignKey("clients", "fk_clients_user");
        await queryRunner.dropForeignKey("clients", "fk_clients_address");
        await queryRunner.dropForeignKey("clients", "fk_clients_fiscal_data");
        await queryRunner.dropForeignKey("clients", "clientes_rastreo_go_userId_fkey");
        await queryRunner.renameColumn("clients", "username", "name");
        await queryRunner.dropColumn("clients", "userId");

        await queryRunner.dropColumn("clients", "fiscalDataId");
        await queryRunner.dropColumn("clients", "addressId");


        // Eliminación de tablas
        await queryRunner.dropForeignKey("commissions", "comisione_rechargePlansMovementId_fkey");
        await queryRunner.dropForeignKey("commissions", "comisione_reportcomisioneId_fkey");
        await queryRunner.dropForeignKey("sim_requests", "FK_solicitud_de_sim_cliente");


        await queryRunner.dropForeignKey("user_roles", "user_role_clientId_fkey");
        await queryRunner.dropForeignKey("user_roles", "user_role_roleId_fkey");
        await queryRunner.dropForeignKey("user_roles", "user_role_userId_fkey");
        await queryRunner.dropForeignKey("recharge_plan_movements", "recharge_plans_movement_rechargePlanId_fkey");
        await queryRunner.dropForeignKey("recharge_plan_movements", "recharge_plans_movement_simId_fkey");
        await queryRunner.dropForeignKey("recharge_plan_movements", "recharge_plans_movement_userId_fkey");
        await queryRunner.dropForeignKey("client_iccids", "cliente_iccid_simId_fkey");
        await queryRunner.dropForeignKey("client_iccids", "cliente_iccid_userId_fkey");
        await queryRunner.dropForeignKey("sim_client_iccids", "sim_cliente_iccid_cliente_iccid_id_fkey");
        await queryRunner.dropForeignKey("sim_client_iccids", "sim_cliente_iccid_sim_id_fkey");


        await queryRunner.dropForeignKey("roles", "role_permissionId_fkey");


        await queryRunner.dropForeignKey("permissions", "permission_roleId_fkey");





    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir renombrar las columnas a camelCase y en inglés
    
        // Tabla 'addresses'
        await queryRunner.renameColumn("addresses", "state", "estado");
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "municipio",
            type: "varchar", // Reemplazar con el tipo original
            isNullable: true // Ajustar según corresponda
        }));
    
        // Tabla 'fiscal_data'
        await queryRunner.renameColumn("fiscal_data", "personType", "tipoPersona");
    
        // Tabla 'users'
        // Recrear la columna 'parentId'
        await queryRunner.addColumn("users", new TableColumn({
            name: "parentId",
            type: "integer", // Reemplazar con el tipo original
            isNullable: true // Ajustar según corresponda
        }));
        // Recrear la clave foránea 'fk_users_parent'
        await queryRunner.createForeignKey("users", new TableForeignKey({
            columnNames: ["parentId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_users_parent"
        }));
    
        // Tabla 'clients'
        // Recrear las columnas eliminadas
        await queryRunner.addColumn("clients", new TableColumn({
            name: "addressId",
            type: "integer", // Reemplazar con el tipo original
            isNullable: true
        }));
        await queryRunner.addColumn("clients", new TableColumn({
            name: "fiscalDataId",
            type: "integer", // Reemplazar con el tipo original
            isNullable: true
        }));
        await queryRunner.addColumn("clients", new TableColumn({
            name: "userId",
            type: "integer", // Reemplazar con el tipo original
            isNullable: true
        }));
        // Renombrar la columna 'name' de vuelta a 'username'
        await queryRunner.renameColumn("clients", "name", "username");
        // Recrear las claves foráneas eliminadas
        await queryRunner.createForeignKey("clients", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_clients_user"
        }));
        await queryRunner.createForeignKey("clients", new TableForeignKey({
            columnNames: ["addressId"],
            referencedTableName: "addresses",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_clients_address"
        }));
        await queryRunner.createForeignKey("clients", new TableForeignKey({
            columnNames: ["fiscalDataId"],
            referencedTableName: "fiscal_data",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_clients_fiscal_data"
        }));
        await queryRunner.createForeignKey("clients", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "clientes_rastreo_go",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "clientes_rastreo_go_userId_fkey"
        }));
    
        // Eliminar las columnas 'addressId', 'fiscalDataId' y 'userId' si fueron añadidas posteriormente
        // (Asegurarse de que no se combinen con otras migraciones)
    
        // Tabla 'commissions'
        await queryRunner.createForeignKey("commissions", new TableForeignKey({
            columnNames: ["rechargePlansMovementId"],
            referencedTableName: "recharge_plan_movements",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "comisione_rechargePlansMovementId_fkey"
        }));
        await queryRunner.createForeignKey("commissions", new TableForeignKey({
            columnNames: ["reportcomisioneId"],
            referencedTableName: "reportcomisione",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "comisione_reportcomisioneId_fkey"
        }));
    
        // Tabla 'sim_requests'
        await queryRunner.createForeignKey("sim_requests", new TableForeignKey({
            columnNames: ["clientId"],
            referencedTableName: "clientes_rastreo_go",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "FK_solicitud_de_sim_cliente"
        }));
    
        // Tabla 'user_roles'
        await queryRunner.createForeignKey("user_roles", new TableForeignKey({
            columnNames: ["clientId"],
            referencedTableName: "clients",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "user_role_clientId_fkey"
        }));
        await queryRunner.createForeignKey("user_roles", new TableForeignKey({
            columnNames: ["roleId"],
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "user_role_roleId_fkey"
        }));
        await queryRunner.createForeignKey("user_roles", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "user_role_userId_fkey"
        }));
    
        // Tabla 'recharge_plan_movements'
        await queryRunner.createForeignKey("recharge_plan_movements", new TableForeignKey({
            columnNames: ["rechargePlanId"],
            referencedTableName: "recharge_plan",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "recharge_plans_movement_rechargePlanId_fkey"
        }));
        await queryRunner.createForeignKey("recharge_plan_movements", new TableForeignKey({
            columnNames: ["simId"],
            referencedTableName: "sim",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "recharge_plans_movement_simId_fkey"
        }));
        await queryRunner.createForeignKey("recharge_plan_movements", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "recharge_plans_movement_userId_fkey"
        }));
    
        // Tabla 'client_iccids'
        await queryRunner.createForeignKey("client_iccids", new TableForeignKey({
            columnNames: ["simId"],
            referencedTableName: "sim",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "cliente_iccid_simId_fkey"
        }));
        await queryRunner.createForeignKey("client_iccids", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "cliente_iccid_userId_fkey"
        }));
    
        // Tabla 'sim_client_iccids'
        await queryRunner.createForeignKey("sim_client_iccids", new TableForeignKey({
            columnNames: ["cliente_iccid_id"],
            referencedTableName: "cliente_iccid",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "sim_cliente_iccid_cliente_iccid_id_fkey"
        }));
        await queryRunner.createForeignKey("sim_client_iccids", new TableForeignKey({
            columnNames: ["sim_id"],
            referencedTableName: "sim",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "sim_cliente_iccid_sim_id_fkey"
        }));
    
        // Tabla 'roles'
        await queryRunner.createForeignKey("roles", new TableForeignKey({
            columnNames: ["permissionId"],
            referencedTableName: "permissions",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "role_permissionId_fkey"
        }));
    
        // Tabla 'permissions'
        await queryRunner.createForeignKey("permissions", new TableForeignKey({
            columnNames: ["roleId"],
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "permission_roleId_fkey"
        }));
    }

}
