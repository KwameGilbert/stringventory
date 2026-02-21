import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (2 levels up from src/config)
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const isProd = process.env.NODE_ENV === 'production';

/**
 * Get connection configuration based on environment
 */
const getConnectionConfig = () => {
  const client = isProd ? process.env.PROD_DB_CLIENT || 'pg' : process.env.DEV_DB_CLIENT || 'pg';

  const databaseUrl = isProd ? process.env.PROD_DATABASE_URL : process.env.DEV_DATABASE_URL;

  if (databaseUrl) {
    return databaseUrl;
  }

  // Build connection object
  const connection = {
    host: isProd ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST || 'localhost',
    port: isProd
      ? parseInt(process.env.PROD_DB_PORT || '5432')
      : parseInt(process.env.DEV_DB_PORT || '5432'),
    user: isProd ? process.env.PROD_DB_USER : process.env.DEV_DB_USER || 'postgres',
    password: isProd ? process.env.PROD_DB_PASSWORD : process.env.DEV_DB_PASSWORD || '',
    database: isProd ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME || 'stringventory_dev',
  };

  // Add MySQL-specific options
  if (client === 'mysql' || client === 'mysql2') {
    return {
      ...connection,
      charset: 'utf8mb4',
      timezone: 'Z',
    };
  }

  return connection;
};

/**
 * Knex configuration
 */
const config = {
  client: isProd ? process.env.PROD_DB_CLIENT || 'pg' : process.env.DEV_DB_CLIENT || 'pg',
  connection: getConnectionConfig(),
  pool: {
    min: isProd
      ? parseInt(process.env.PROD_DB_POOL_MIN || '2')
      : parseInt(process.env.DEV_DB_POOL_MIN || '2'),
    max: isProd
      ? parseInt(process.env.PROD_DB_POOL_MAX || '20')
      : parseInt(process.env.DEV_DB_POOL_MAX || '10'),
  },
  migrations: {
    directory: '../../src/database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: '../../src/database/seeds',
  },
};

export default config;
