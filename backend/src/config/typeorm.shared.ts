import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Paths das entidades e migrations
export const entitiesPath = join(__dirname, '..', '**', '*.entity{.ts,.js}');
export const migrationsPath = join(
  __dirname,
  '..',
  'database',
  'migrations',
  `*{.ts,.js}`,
);

// Configuração base do TypeORM
export const typeOrmSharedConfig = (): DataSourceOptions => {
  const isUrl = !!process.env.DATABASE_URL;
  const useSSL = !!process.env.useSSL;

  return {
    ...(isUrl
      ? {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          ssl: useSSL,
        }
      : {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'solidarios',
          ssl: useSSL,
        }),
    entities: [entitiesPath],
    migrations: [migrationsPath],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  };
};
