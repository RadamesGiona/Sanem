// src/config/typeorm.config.ts (modificado)
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { typeOrmSharedConfig } from './typeorm.shared';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Exporta o DataSource para ser usado pela CLI do TypeORM e pelo aplicativo
export const AppDataSource = new DataSource({
  ...typeOrmSharedConfig(),
  migrationsRun: true,
  migrationsTableName: 'migrations',
});
