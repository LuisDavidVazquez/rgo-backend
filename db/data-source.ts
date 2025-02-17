import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno desde el archivo .env

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    synchronize: false, // Desactiva la sincronización con la base de datos
    migrationsTableName: "migrations",


};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
