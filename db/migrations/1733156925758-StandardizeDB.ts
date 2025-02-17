import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class StandardizeDB1733156925758 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Renombrar la tabla de 'datos_fiscale' a 'fiscal_data'
        await queryRunner.renameTable("datos_fiscale", "fiscal_data");

        // Agregar nuevas columnas a 'fiscal_data'
        await queryRunner.addColumns("fiscal_data", [
            new TableColumn({
                name: "clientId",
                type: "integer",
                isNullable: true,
            }),
            new TableColumn({
                name: "businessName",
                type: "character varying",
                length: "255",
                isNullable: true,
            }),
            new TableColumn({
                name: "fiscalRegime",
                type: "character varying",
                length: "255",
                isNullable: true,
            }),
            new TableColumn({
                name: "cdfiUsage",
                type: "character varying",
                length: "255",
                isNullable: true,
            }),
            new TableColumn({
                name: "paymentMethod",
                type: "character varying",
                length: "255",
                isNullable: true,
            }),
            new TableColumn({
                name: "paymentForm",
                type: "character varying",
                length: "255",
                isNullable: true,
            }),
            new TableColumn({
                name: "paymentCurrency",
                type: "character varying",
                length: "10",
                isNullable: true,
                default: `'MXN'`
            })
        ]);

        // Renombrar la tabla de 'bitacora' a 'action_logs'
        await queryRunner.renameTable("bitacora", "action_logs");
        // Renombrar la columna 'timestamp' a 'createdAt'
        await queryRunner.renameColumn("action_logs", "timestamp", "createdAt");

        // Renombrar la tabla de 'reportcomisione' a 'commission_reports'
        await queryRunner.renameTable("reportcomisione", "commission_reports");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("commission_reports", "idcomisione", "commissionId");
        await queryRunner.renameColumn("commission_reports", "IsActive", "isActive");


        // Renombrar la tabla de 'token' a 'tokens'
        await queryRunner.renameTable("token", "tokens");

        // Renombrar la columna a camelCase y en inglés
        await queryRunner.renameColumn("tokens", "fechaObtencion", "obtainedAt");

        // Renombrar la tabla de 'permission' a 'permissions'
        await queryRunner.renameTable("permission", "permissions");

        // Renombrar la tabla de 'role' a 'roles'
        await queryRunner.renameTable("role", "roles");

        // Renombrar la tabla de 'user_role' a 'user_roles'
        await queryRunner.renameTable("user_role", "user_roles");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("user_roles", "userId", "userId");
        await queryRunner.renameColumn("user_roles", "clientId", "clientId");
        await queryRunner.renameColumn("user_roles", "roleType", "roleType");
        await queryRunner.renameColumn("user_roles", "roleId", "roleId");


        // Renombrar la tabla de 'clientes_rastreo_go' a 'clients'
        await queryRunner.renameTable("clientes_rastreo_go", "clients");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("clients", "clientlevel", "clientLevel");
        await queryRunner.renameColumn("clients", "externalId", "externalId");
        await queryRunner.renameColumn("clients", "userId", "userId");
        await queryRunner.renameColumn("clients", "IsActive", "isActive");
        await queryRunner.renameColumn("clients", "externalPlatformId", "externalPlatformId");
        await queryRunner.renameColumn("clients", "datosFiscalesId", "fiscalDataId");
        await queryRunner.renameColumn("clients", "direccionId", "addressId");




        // Renombrar la tabla de 'direcciones' a 'addresses'
        await queryRunner.renameTable("direccione", "addresses");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("addresses", "calle", "street");
        await queryRunner.renameColumn("addresses", "codigoPostal", "postalCode");

/////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////

        await queryRunner.addColumn("addresses", new TableColumn({
            name: "number",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "neighborhood",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "city",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "country",
            type: "varchar",
            isNullable: true,
            default: "'México'"
        }));


        await queryRunner.addColumn("addresses", new TableColumn({
            name: "clientId",
            type: "integer",
            isNullable: true
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
        }));
        await queryRunner.addColumn("addresses", new TableColumn({
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        }));


        await queryRunner.renameTable("notification_preference", "notification_preferences");
        await queryRunner.renameTable("sims_inventario", "sim_inventories");
        await queryRunner.renameColumn("sim_inventories", "distributorId", "clientId");

        // Renombrar la tabla de 'solicitudes_de_sim' a 'client_registration_requests'
        await queryRunner.renameTable("solicitudes", "client_registration_requests");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.addColumn("client_registration_requests", new TableColumn({
            name: "clientId",
            type: "integer",
            isNullable: true
        }));
        await queryRunner.renameColumn("client_registration_requests", "calle", "street");
        await queryRunner.addColumn("client_registration_requests", new TableColumn({
            name: "neighborhood",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.renameColumn("client_registration_requests", "codigoPostal", "postalCode");
        await queryRunner.renameColumn("client_registration_requests", "estado", "state");
        await queryRunner.renameColumn("client_registration_requests", "municipio", "municipality");
        //        await queryRunner.renameColumn("client_registration_requests", "cantidadSimsSolicitadas", "numberOfSimsRequested");
        await queryRunner.addColumn("client_registration_requests", new TableColumn({
            name: "requestDate",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: true
        }));
        await queryRunner.renameColumn("client_registration_requests", "username", "name");
        await queryRunner.addColumn("client_registration_requests", new TableColumn({
            name: "requestStatus",
            type: "varchar",
            isNullable: true
        }));
        // Agregar cualquier otra columna que necesite ser renombrada





        // Renombrar la tabla de 'solicitud_de_sim' a 'sim_requests'
        await queryRunner.renameTable("solicitud_de_sim", "sim_requests");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("sim_requests", "clienteId", "clientId");
        await queryRunner.renameColumn("sim_requests", "calle", "street");
        await queryRunner.renameColumn("sim_requests", "colonia", "colony");
        await queryRunner.renameColumn("sim_requests", "codigoPostal", "postalCode");
        await queryRunner.renameColumn("sim_requests", "estado", "state");
        await queryRunner.renameColumn("sim_requests", "municipio", "city");
        await queryRunner.renameColumn("sim_requests", "cantidadSimsSolicitadas", "requestedSimsQuantity");
        await queryRunner.renameColumn("sim_requests", "fechaSolicitud", "requestDate");
        await queryRunner.renameColumn("sim_requests", "nombre", "name");
        await queryRunner.renameColumn("sim_requests", "statusSolicitud", "requestStatus");


        // Renombrar la tabla de 'user' a 'users'
        await queryRunner.renameTable("user", "users");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("users", "clientlevel", "clientLevel");
        await queryRunner.renameColumn("users", "externalId", "externalId");
        await queryRunner.renameColumn("users", "IsActive", "isActive");
        await queryRunner.renameColumn("users", "externalPlatformId", "externalPlatformId");
        await queryRunner.renameColumn("users", "idPadre", "parentId");
        await queryRunner.query(`ALTER TABLE public.users ALTER COLUMN "parentId" DROP NOT NULL`);
        await queryRunner.renameColumn("users", "clienteRastreoGoId", "clientId");




        // Renombrar la tabla de 'sim' a 'sims'
        await queryRunner.renameTable("sim", "sims");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("sims", "distributorId", "clientId");
        await queryRunner.renameColumn("sims", "client", "clientName");



        // Renombrar la tabla de 'cliente_iccid' a 'client_iccids'
        await queryRunner.renameTable("cliente_iccid", "client_iccids");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("client_iccids", "unitname", "unitName");
        await queryRunner.renameColumn("client_iccids", "IsActive", "isActive");
        await queryRunner.renameColumn("client_iccids", "simId", "simId");
        await queryRunner.renameColumn("client_iccids", "distributorId", "clientId");
        // "userId" ya está en camelCase y en inglés, por lo que no es necesario renombrarla


        await queryRunner.renameTable("sim_cliente_iccid", "sim_client_iccids");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("sim_client_iccids", "sim_id", "simId");
        await queryRunner.renameColumn("sim_client_iccids", "cliente_iccid_id", "clientIccidId");



        // Renombrar la tabla de 'recharge_plans_movement' a 'recharge_plan_movements'
        await queryRunner.renameTable("recharge_plans_movement", "recharge_plan_movements");

        // Renombrar las columnas a camelCase y en inglés
        await queryRunner.renameColumn("recharge_plan_movements", "UpdatedAt", "updatedAt");
        await queryRunner.renameColumn("recharge_plan_movements", "simId", "simId");
        await queryRunner.renameColumn("recharge_plan_movements", "userId", "userId");
        await queryRunner.renameColumn("recharge_plan_movements", "planName", "planName");
        await queryRunner.renameColumn("recharge_plan_movements", "rechargePlanId", "rechargePlanId");
        await queryRunner.renameColumn("recharge_plan_movements", "statusPago", "paymentStatus");
        await queryRunner.renameColumn("recharge_plan_movements", "transactionNumber", "transactionNumber");
        await queryRunner.renameColumn("recharge_plan_movements", "paymentId", "paymentId");

        // Eliminar columnas duplicadas
        await queryRunner.query(`
                ALTER TABLE public.recharge_plan_movements
                  DROP COLUMN IF EXISTS updated_at,
                  DROP COLUMN IF EXISTS created_at;
            `);


        // Renombrar la tabla de 'recharge_plan' a 'recharge_plans'
        await queryRunner.renameTable("recharge_plan", "recharge_plans");

        // Renombrar las columnas a camelCase y en inglés
        // Aunque los nombres no cambian, se incluye por consistencia
        await queryRunner.renameColumn("recharge_plans", "createdAt", "createdAt");
        await queryRunner.renameColumn("recharge_plans", "updatedAt", "updatedAt");


        // Renombrar la tabla de 'comisione' a 'commissions'
        await queryRunner.renameTable("comisione", "commissions");

        // Renombrar las columnas a camelCase y en inglés
        //await queryRunner.renameColumn("commissions", "id", "commissionId");
        await queryRunner.renameColumn("commissions", "idcompaniclient", "companyClientId");
        await queryRunner.renameColumn("commissions", "recarga", "recharge");
        await queryRunner.renameColumn("commissions", "comision", "commission");
        await queryRunner.renameColumn("commissions", "createAt", "createdAt");
        await queryRunner.renameColumn("commissions", "updateAt", "updatedAt");
        await queryRunner.renameColumn("commissions", "IsActive", "isActive");
        await queryRunner.renameColumn("commissions", "reportcomisioneId", "commissionReportId");
        await queryRunner.renameColumn("commissions", "rechargePlansMovementId", "rechargePlanMovementId");
        await queryRunner.renameColumn("commissions", "activacion", "activation");






        // Agregar campos de auditoría adicionales
        await queryRunner.query(`
                    ALTER TABLE public.tokens
                      ADD COLUMN createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      ADD COLUMN updatedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      ADD COLUMN expiresAt timestamp without time zone;
                `);




    }
    /////////////////////////////////////////////////////////////////////////////////////
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar campos de auditoría adicionales
        await queryRunner.query(`
            ALTER TABLE public.tokens
              DROP COLUMN IF EXISTS expiresAt,
              DROP COLUMN IF EXISTS updatedAt,
              DROP COLUMN IF EXISTS createdAt;
        `);
    
        // Renombrar las columnas a sus nombres originales
        await queryRunner.renameColumn("commissions", "activation", "activacion");
        await queryRunner.renameColumn("commissions", "rechargePlanMovementId", "rechargePlansMovementId");
        await queryRunner.renameColumn("commissions", "commissionReportId", "reportcomisioneId");
        await queryRunner.renameColumn("commissions", "isActive", "IsActive");
        await queryRunner.renameColumn("commissions", "updatedAt", "updateAt");
        await queryRunner.renameColumn("commissions", "createdAt", "createAt");
        await queryRunner.renameColumn("commissions", "commission", "comision");
        await queryRunner.renameColumn("commissions", "recharge", "recarga");
        await queryRunner.renameColumn("commissions", "companyClientId", "idcompaniclient");
    
        // Renombrar la tabla de vuelta a 'comisione'
        await queryRunner.renameTable("commissions", "comisione");
    
        // Renombrar las columnas a sus nombres originales en 'recharge_plans'
        await queryRunner.renameColumn("recharge_plans", "updatedAt", "updatedAt");
        await queryRunner.renameColumn("recharge_plans", "createdAt", "createdAt");
    
        // Renombrar la tabla de vuelta a 'recharge_plan'
        await queryRunner.renameTable("recharge_plans", "recharge_plan");
    
        // Restaurar las columnas eliminadas en 'recharge_plan_movements'
        await queryRunner.query(`
            ALTER TABLE public.recharge_plan_movements
              ADD COLUMN updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
              ADD COLUMN created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;
        `);
    
        // Renombrar las columnas a sus nombres originales en 'recharge_plan_movements'
        await queryRunner.renameColumn("recharge_plan_movements", "paymentId", "paymentId");
        await queryRunner.renameColumn("recharge_plan_movements", "transactionNumber", "transactionNumber");
        await queryRunner.renameColumn("recharge_plan_movements", "paymentStatus", "statusPago");
        await queryRunner.renameColumn("recharge_plan_movements", "rechargePlanId", "rechargePlanId");
        await queryRunner.renameColumn("recharge_plan_movements", "planName", "planName");
        await queryRunner.renameColumn("recharge_plan_movements", "userId", "userId");
        await queryRunner.renameColumn("recharge_plan_movements", "simId", "simId");
        await queryRunner.renameColumn("recharge_plan_movements", "updatedAt", "UpdatedAt");
    
        // Renombrar la tabla de vuelta a 'recharge_plans_movement'
        await queryRunner.renameTable("recharge_plan_movements", "recharge_plans_movement");
    
        // Renombrar las columnas a sus nombres originales en 'sim_requests'
        await queryRunner.renameColumn("sim_requests", "name", "username");
        await queryRunner.renameColumn("sim_requests", "requestDate", "fechaSolicitud");
        await queryRunner.renameColumn("sim_requests", "requestedSimsQuantity", "cantidadSimsSolicitadas");
        await queryRunner.renameColumn("sim_requests", "city", "municipio");
        await queryRunner.renameColumn("sim_requests", "state", "estado");
        await queryRunner.renameColumn("sim_requests", "postalCode", "codigoPostal");
        await queryRunner.renameColumn("sim_requests", "colony", "colonia");
        await queryRunner.renameColumn("sim_requests", "street", "calle");
        await queryRunner.renameColumn("sim_requests", "clientId", "clienteId");
    
        // Renombrar la tabla de vuelta a 'solicitud_de_sim'
        await queryRunner.renameTable("sim_requests", "solicitud_de_sim");
    
        // Eliminar columnas agregadas en 'client_registration_requests'
        await queryRunner.dropColumn("client_registration_requests", "requestStatus");
        await queryRunner.dropColumn("client_registration_requests", "name");
        await queryRunner.dropColumn("client_registration_requests", "requestDate");
        await queryRunner.dropColumn("client_registration_requests", "neighborhood");
        await queryRunner.dropColumn("client_registration_requests", "clientId");
    
        // Renombrar las columnas a sus nombres originales en 'client_registration_requests'
        await queryRunner.renameColumn("client_registration_requests", "postalCode", "codigoPostal");
        await queryRunner.renameColumn("client_registration_requests", "street", "calle");
    
        // Renombrar la tabla de vuelta a 'solicitudes'
        await queryRunner.renameTable("client_registration_requests", "solicitudes");
    
        // Renombrar las columnas a sus nombres originales en 'sim_inventories'
        await queryRunner.renameColumn("sim_inventories", "clientId", "distributorId");
    
        // Renombrar la tabla de vuelta a 'sims_inventario'
        await queryRunner.renameTable("sim_inventories", "sims_inventario");
    
        // Eliminar columnas agregadas en 'addresses'
        await queryRunner.dropColumn("addresses", "updatedAt");
        await queryRunner.dropColumn("addresses", "createdAt");
        await queryRunner.dropColumn("addresses", "clientId");
        await queryRunner.dropColumn("addresses", "country");
        await queryRunner.dropColumn("addresses", "city");
        await queryRunner.dropColumn("addresses", "neighborhood");
        await queryRunner.dropColumn("addresses", "number");
    
        // Renombrar las columnas a sus nombres originales en 'addresses'
        await queryRunner.renameColumn("addresses", "postalCode", "codigoPostal");
        await queryRunner.renameColumn("addresses", "street", "calle");
    
        // Renombrar la tabla de vuelta a 'direcciones'
        await queryRunner.renameTable("addresses", "direccione");
    
        // Renombrar las columnas a sus nombres originales en 'clients'
        await queryRunner.renameColumn("clients", "addressId", "direccionId");
        await queryRunner.renameColumn("clients", "fiscalDataId", "datosFiscalesId");
        await queryRunner.renameColumn("clients", "externalPlatformId", "externalPlatformId");
        await queryRunner.renameColumn("clients", "isActive", "IsActive");
        await queryRunner.renameColumn("clients", "userId", "userId");
        await queryRunner.renameColumn("clients", "externalId", "externalId");
        await queryRunner.renameColumn("clients", "clientLevel", "clientlevel");
    
        // Renombrar la tabla de vuelta a 'clientes_rastreo_go'
        await queryRunner.renameTable("clients", "clientes_rastreo_go");
    
        // Renombrar las columnas a sus nombres originales en 'user_roles'
        await queryRunner.renameColumn("user_roles", "roleId", "roleId");
        await queryRunner.renameColumn("user_roles", "roleType", "roleType");
        await queryRunner.renameColumn("user_roles", "clientId", "clientId");
        await queryRunner.renameColumn("user_roles", "userId", "userId");
    
        // Renombrar la tabla de vuelta a 'user_role'
        await queryRunner.renameTable("user_roles", "user_role");
    
        // Renombrar las columnas a sus nombres originales en 'users'
        await queryRunner.renameColumn("users", "clientId", "clienteRastreoGoId");
        await queryRunner.renameColumn("users", "parentId", "idPadre");
        await queryRunner.renameColumn("users", "externalPlatformId", "externalPlatformId");
        await queryRunner.renameColumn("users", "isActive", "IsActive");
        await queryRunner.renameColumn("users", "externalId", "externalId");
        await queryRunner.renameColumn("users", "clientLevel", "clientlevel");
    
        // Renombrar la columna 'createdAt' de vuelta a 'timestamp' y la tabla a 'bitacora'
        await queryRunner.renameColumn("action_logs", "createdAt", "timestamp");
        await queryRunner.renameTable("action_logs", "bitacora");
    
        // Renombrar las columnas a sus nombres originales en 'fiscal_data'
        await queryRunner.dropColumn("fiscal_data", "paymentCurrency");
        await queryRunner.dropColumn("fiscal_data", "paymentForm");
        await queryRunner.dropColumn("fiscal_data", "paymentMethod");
        await queryRunner.dropColumn("fiscal_data", "cdfiUsage");
        await queryRunner.dropColumn("fiscal_data", "fiscalRegime");
        await queryRunner.dropColumn("fiscal_data", "businessName");
        await queryRunner.dropColumn("fiscal_data", "clientId");
    
        // Renombrar la tabla de vuelta a 'datos_fiscale'
        await queryRunner.renameTable("fiscal_data", "datos_fiscale");
    }
}
