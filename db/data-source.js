"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();

exports.dataSourceOptions = {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    synchronize: false,
};

const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;