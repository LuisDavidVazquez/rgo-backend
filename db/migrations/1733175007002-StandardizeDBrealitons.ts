import { MigrationInterface, QueryRunner, TableForeignKey, TableIndex } from "typeorm";

export class StandardizeDBrealitons1733175007002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.tokens
            RENAME CONSTRAINT token_pkey TO tokens_pkey;
        `);

        // Crear índices útiles
        await queryRunner.createIndex("tokens", new TableIndex({
            name: "idx_tokens_token",
            columnNames: ["token"]
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
                ALTER TABLE public.commission_reports
                RENAME CONSTRAINT reportcomisione_pkey TO commission_reports_pkey;
            `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
                ALTER TABLE public.commission_reports
                  ADD CONSTRAINT fk_commission_reports_commission
                    FOREIGN KEY ("commissionId")
                    REFERENCES public.commissions(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION;
            `);

        // Crear índices para las claves foráneas
        await queryRunner.createIndex("commission_reports", new TableIndex({
            name: "idx_commission_reports_commissionId",
            columnNames: ["commissionId"]
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
                ALTER TABLE public.commissions
                RENAME CONSTRAINT comisione_pkey TO commissions_pkey;
            `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
                ALTER TABLE public.commissions
                  ADD CONSTRAINT fk_commissions_report
                    FOREIGN KEY ("commissionReportId")
                    REFERENCES public.commission_reports(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
                  ADD CONSTRAINT fk_commissions_recharge_plan_movement
                    FOREIGN KEY ("rechargePlanMovementId")
                    REFERENCES public.recharge_plan_movements(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION;
            `);

        // Crear índices para las claves foráneas
        await queryRunner.createIndex("commissions", new TableIndex({
            name: "idx_commissions_companyClientId",
            columnNames: ["companyClientId"]
        }));

        await queryRunner.createIndex("commissions", new TableIndex({
            name: "idx_commissions_commissionReportId",
            columnNames: ["commissionReportId"]
        }));

        await queryRunner.createIndex("commissions", new TableIndex({
            name: "idx_commissions_rechargePlanMovementId",
            columnNames: ["rechargePlanMovementId"]
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
                    ALTER TABLE public.recharge_plans
                    RENAME CONSTRAINT recharge_plan_pkey TO recharge_plans_pkey;
                `);

        // Crear índices útiles
        await queryRunner.createIndex("recharge_plans", new TableIndex({
            name: "idx_recharge_plans_name",
            columnNames: ["name"]
        }));

        await queryRunner.createIndex("recharge_plans", new TableIndex({
            name: "idx_recharge_plans_amount",
            columnNames: ["amount"]
        }));

        await queryRunner.createIndex("recharge_plans", new TableIndex({
            name: "idx_recharge_plans_days",
            columnNames: ["days"]
        }));


        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.recharge_plan_movements
            RENAME CONSTRAINT recharge_plans_movement_pkey TO recharge_plan_movements_pkey;
        `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
            ALTER TABLE public.recharge_plan_movements
              ADD CONSTRAINT fk_recharge_plan_movements_sim
                FOREIGN KEY ("simId")
                REFERENCES public.sims(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION,
              ADD CONSTRAINT fk_recharge_plan_movements_user
                FOREIGN KEY ("userId")
                REFERENCES public.users(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION,
              ADD CONSTRAINT fk_recharge_plan_movements_recharge_plan
                FOREIGN KEY ("rechargePlanId")
                REFERENCES public.recharge_plans(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION;
        `);

        // Crear índices para las claves foráneas
        await queryRunner.createIndex("recharge_plan_movements", new TableIndex({
            name: "idx_recharge_plan_movements_simId",
            columnNames: ["simId"]
        }));

        await queryRunner.createIndex("recharge_plan_movements", new TableIndex({
            name: "idx_recharge_plan_movements_userId",
            columnNames: ["userId"]
        }));

        await queryRunner.createIndex("recharge_plan_movements", new TableIndex({
            name: "idx_recharge_plan_movements_rechargePlanId",
            columnNames: ["rechargePlanId"]
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
                    ALTER TABLE public.clients
                    RENAME CONSTRAINT clientes_rastreo_go_pkey TO clients_pkey;
                `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
                    ALTER TABLE public.clients
                        ADD CONSTRAINT fk_clients_user
                            FOREIGN KEY ("userId")
                            REFERENCES public.users(id)
                            ON DELETE CASCADE
                            ON UPDATE NO ACTION,
                        ADD CONSTRAINT fk_clients_fiscal_data
                            FOREIGN KEY ("fiscalDataId")
                            REFERENCES public.fiscal_data(id)
                            ON DELETE CASCADE
                            ON UPDATE NO ACTION,
                        ADD CONSTRAINT fk_clients_address
                            FOREIGN KEY ("addressId")
                            REFERENCES public.addresses(id)
                            ON DELETE CASCADE
                            ON UPDATE NO ACTION;
                `);

        // Agregar restricción de clave foránea para 'clientId' en la tabla 'addresses'
        await queryRunner.query(`
            ALTER TABLE public.addresses
            ADD CONSTRAINT fk_addresses_client
            FOREIGN KEY ("clientId")
            REFERENCES public.clients(id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION;
        `);

        // Crear índice para la clave foránea 'clientId'
        await queryRunner.query(`
            CREATE INDEX idx_addresses_clientId ON public.addresses("clientId");
        `);

        // Crear índice para la columna 'clientId'
        await queryRunner.createIndex("fiscal_data", new TableIndex({
            columnNames: ["clientId"],
            name: "fk_fiscal_data_client"
        }));

        // Agregar la restricción de clave foránea
        await queryRunner.createForeignKey("fiscal_data", new TableForeignKey({
            columnNames: ["clientId"],
            referencedTableName: "clients",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_fiscal_data_client"
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.sim_requests
            RENAME CONSTRAINT "PK_solicitud_de_sim" TO sim_requests_pkey;
        `);

        // Agregar restricción de clave foránea para 'clientId'
        await queryRunner.createForeignKey("sim_requests", new TableForeignKey({
            columnNames: ["clientId"],
            referencedTableName: "clients",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_sim_requests_client"
        }));
        // Renombrar la restricción primaria
        await queryRunner.query(`
                ALTER TABLE public.users
                RENAME CONSTRAINT user_pkey TO users_pkey;
            `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
                ALTER TABLE public.users
                    ADD CONSTRAINT fk_users_parent
                        FOREIGN KEY ("parentId")
                        REFERENCES public.users(id)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION,
                    ADD CONSTRAINT fk_users_client
                        FOREIGN KEY ("clientId")
                        REFERENCES public.clients(id)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION;
            `);

        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.client_iccids
            RENAME CONSTRAINT cliente_iccid_pkey TO client_iccids_pkey;
        `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
            ALTER TABLE public.client_iccids
                ADD CONSTRAINT fk_client_iccids_user
                    FOREIGN KEY ("userId")
                    REFERENCES public.users(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
                ADD CONSTRAINT fk_client_iccids_sim
                    FOREIGN KEY ("simId")
                    REFERENCES public.sims(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
                ADD CONSTRAINT fk_client_iccids_client
                    FOREIGN KEY ("clientId")
                    REFERENCES public.clients(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION;
        `);

        // Crear índices para las claves foráneas
        await queryRunner.createIndex("client_iccids", new TableIndex({
            name: "idx_client_iccids_userId",
            columnNames: ["userId"]
        }));

        await queryRunner.createIndex("client_iccids", new TableIndex({
            name: "idx_client_iccids_simId",
            columnNames: ["simId"]
        }));

        await queryRunner.createIndex("client_iccids", new TableIndex({
            name: "idx_client_iccids_clientId",
            columnNames: ["clientId"]
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.sim_client_iccids
            RENAME CONSTRAINT sim_cliente_iccid_pkey TO sim_client_iccids_pkey;
        `);

        // Agregar restricciones de claves foráneas
        await queryRunner.query(`
            ALTER TABLE public.sim_client_iccids
                ADD CONSTRAINT fk_sim_client_iccids_sim
                    FOREIGN KEY ("simId")
                    REFERENCES public.sims(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
                ADD CONSTRAINT fk_sim_client_iccids_client_iccid
                    FOREIGN KEY ("clientIccidId")
                    REFERENCES public.client_iccids(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION;
        `);

        // Crear índices para las claves foráneas
        await queryRunner.createIndex("sim_client_iccids", new TableIndex({
            name: "idx_sim_client_iccids_simId",
            columnNames: ["simId"]
        }));

        await queryRunner.createIndex("sim_client_iccids", new TableIndex({
            name: "idx_sim_client_iccids_clientIccidId",
            columnNames: ["clientIccidId"]
        }));

        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.sims
            RENAME CONSTRAINT sim_pkey TO sims_pkey;
        `);

        // Agregar restricciones de claves foráneas
        await queryRunner.createForeignKey("sims", new TableForeignKey({
            columnNames: ["clientId"],
            referencedTableName: "clients",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_sims_client"
        }));

        await queryRunner.createForeignKey("sims", new TableForeignKey({
            columnNames: ["rechargePlanId"],
            referencedTableName: "recharge_plans",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
            name: "fk_sims_recharge_plan"
        }));




        // Renombrar la restricción primaria
        await queryRunner.query(`
                ALTER TABLE public.action_logs
                RENAME CONSTRAINT bitacora_pkey TO action_logs_pkey;
            `);

        // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.roles
            RENAME CONSTRAINT role_pkey TO roles_pkey;
        `);

        // Agregar restricción de clave foránea para 'permissionId'
        await queryRunner.query(`
            ALTER TABLE public.roles
              ADD CONSTRAINT fk_roles_permission
                FOREIGN KEY ("permissionId")
                REFERENCES public.permissions(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION;
        `);
        // Crear índice para la clave foránea
        await queryRunner.createIndex("roles", new TableIndex({
            name: "idx_roles_permissionId",
            columnNames: ["permissionId"]
        }));

                // Crear índices para las claves foráneas
                await queryRunner.createIndex("user_roles", new TableIndex({
                    name: "idx_user_roles_userId",
                    columnNames: ["userId"]
                }));
        
                await queryRunner.createIndex("user_roles", new TableIndex({
                    name: "idx_user_roles_clientId",
                    columnNames: ["clientId"]
                }));
        
                await queryRunner.createIndex("user_roles", new TableIndex({
                    name: "idx_user_roles_roleId",
                    columnNames: ["roleId"]
                }));

                   // Renombrar la restricción primaria
        await queryRunner.query(`
            ALTER TABLE public.user_roles
            RENAME CONSTRAINT user_role_pkey TO user_roles_pkey;
        `);
                   // Agregar restricciones de claves foráneas para 'userId', 'clientId' y 'roleId'
        await queryRunner.query(`
            ALTER TABLE public.user_roles
              ADD CONSTRAINT fk_user_roles_user
                FOREIGN KEY ("userId")
                REFERENCES public.users(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION,
              ADD CONSTRAINT fk_user_roles_client
                FOREIGN KEY ("clientId")
                REFERENCES public.clients(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION,
              ADD CONSTRAINT fk_user_roles_role
                FOREIGN KEY ("roleId")
                REFERENCES public.roles(id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION;
        `);
              // Renombrar la restricción primaria
              await queryRunner.query(`
                ALTER TABLE public.permissions
                RENAME CONSTRAINT permission_pkey TO permissions_pkey;
            `);
    
            // Agregar restricción de clave foránea para 'roleId'
            await queryRunner.query(`
                ALTER TABLE public.permissions
                  ADD CONSTRAINT fk_permissions_role
                    FOREIGN KEY ("roleId")
                    REFERENCES public.roles(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION;
            `);
    
            // Crear índice para la clave foránea
            await queryRunner.createIndex("permissions", new TableIndex({
                name: "idx_permissions_roleId",
                columnNames: ["roleId"]
            }));



    }

        public async down(queryRunner: QueryRunner): Promise<void> {
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.sims
                RENAME CONSTRAINT sims_pkey TO sim_pkey;
            `);
        
            // Eliminar restricciones de claves foráneas
            await queryRunner.query(`
                ALTER TABLE public.sim_client_iccids
                    DROP CONSTRAINT IF EXISTS fk_sim_client_iccids_sim,
                    DROP CONSTRAINT IF EXISTS fk_sim_client_iccids_client_iccid;
            `);
        
            // Eliminar índices para claves foráneas
            await queryRunner.dropIndex("sim_client_iccids", "idx_sim_client_iccids_clientIccidId");
            await queryRunner.dropIndex("sim_client_iccids", "idx_sim_client_iccids_simId");
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.sim_client_iccids
                RENAME CONSTRAINT sim_client_iccids_pkey TO sim_cliente_iccid_pkey;
            `);
        
            // Eliminar restricciones de claves foráneas
            await queryRunner.query(`
                ALTER TABLE public.client_iccids
                    DROP CONSTRAINT IF EXISTS fk_client_iccids_user,
                    DROP CONSTRAINT IF EXISTS fk_client_iccids_sim,
                    DROP CONSTRAINT IF EXISTS fk_client_iccids_client;
            `);
        
            // Eliminar índices de las claves foráneas
            await queryRunner.dropIndex("client_iccids", "idx_client_iccids_clientId");
            await queryRunner.dropIndex("client_iccids", "idx_client_iccids_simId");
            await queryRunner.dropIndex("client_iccids", "idx_client_iccids_userId");
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.client_iccids
                RENAME CONSTRAINT client_iccids_pkey TO cliente_iccid_pkey;
            `);
        
            // Eliminar restricción de clave foránea y el índice
            await queryRunner.dropIndex("fiscal_data", "fk_fiscal_data_client");
            await queryRunner.query(`
                ALTER TABLE public.fiscal_data
                DROP CONSTRAINT IF EXISTS fk_fiscal_data_client;
            `);
        
            // Eliminar el índice de 'clientId'
            await queryRunner.query(`
                DROP INDEX IF EXISTS idx_addresses_clientId;
            `);
        
            // Eliminar la restricción de clave foránea para 'clientId' en 'addresses'
            await queryRunner.query(`
                ALTER TABLE public.addresses
                DROP CONSTRAINT IF EXISTS fk_addresses_client;
            `);
        
            // Eliminar restricciones de claves foráneas en 'clients'
            await queryRunner.query(`
                ALTER TABLE public.clients
                    DROP CONSTRAINT IF EXISTS fk_clients_user,
                    DROP CONSTRAINT IF EXISTS fk_clients_fiscal_data,
                    DROP CONSTRAINT IF EXISTS fk_clients_address;
            `);
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.clients
                RENAME CONSTRAINT clients_pkey TO clientes_rastreo_go_pkey;
            `);
        
            // Eliminar restricciones de claves foráneas en 'users'
            await queryRunner.query(`
                ALTER TABLE public.users
                DROP CONSTRAINT IF EXISTS fk_users_parent,
                DROP CONSTRAINT IF EXISTS fk_users_client;
            `);
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.users
                RENAME CONSTRAINT users_pkey TO user_pkey;
            `);
        
            // Eliminar restricciones de claves foráneas en 'commissions'
            await queryRunner.query(`
                ALTER TABLE public.commissions
                DROP CONSTRAINT IF EXISTS fk_commissions_company_client,
                DROP CONSTRAINT IF EXISTS fk_commissions_report,
                DROP CONSTRAINT IF EXISTS fk_commissions_recharge_plan_movement;
            `);
        
            // Eliminar índices para claves foráneas en 'commissions'
            await queryRunner.dropIndex("commissions", "idx_commissions_rechargePlanMovementId");
            await queryRunner.dropIndex("commissions", "idx_commissions_commissionReportId");
            await queryRunner.dropIndex("commissions", "idx_commissions_companyClientId");
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.commissions
                RENAME CONSTRAINT commissions_pkey TO comisione_pkey;
            `);
        
            // Eliminar restricciones de claves foráneas en 'commission_reports'
            await queryRunner.query(`
                ALTER TABLE public.commission_reports
                DROP CONSTRAINT IF EXISTS fk_commission_reports_commission;
            `);
        
            // Eliminar índices para claves foráneas en 'commission_reports'
            await queryRunner.dropIndex("commission_reports", "idx_commission_reports_commissionId");
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.commission_reports
                RENAME CONSTRAINT commission_reports_pkey TO reportcomisione_pkey;
            `);
        
            // Eliminar índices en 'tokens'
            await queryRunner.dropIndex("tokens", "idx_tokens_token");
        
            // Renombrar la restricción primaria de vuelta
            await queryRunner.query(`
                ALTER TABLE public.tokens
                RENAME CONSTRAINT tokens_pkey TO token_pkey;
            `);
        }
}
