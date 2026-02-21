import knex from 'knex';
import { env, isProduction } from './env.js';
import { logger } from './logger.js';

/**
 * Get database configuration based on environment
 */
const getConfig = () => {
  const isProd = isProduction;

  // Select configuration based on environment
  const client = isProd ? env.PROD_DB_CLIENT : env.DEV_DB_CLIENT;
  const databaseUrl = isProd ? env.PROD_DATABASE_URL : env.DEV_DATABASE_URL;

  const connection = databaseUrl || {
    host: isProd ? env.PROD_DB_HOST : env.DEV_DB_HOST,
    port: isProd ? env.PROD_DB_PORT : env.DEV_DB_PORT,
    user: isProd ? env.PROD_DB_USER : env.DEV_DB_USER,
    password: isProd ? env.PROD_DB_PASSWORD : env.DEV_DB_PASSWORD,
    database: isProd ? env.PROD_DB_NAME : env.DEV_DB_NAME,
  };

  // Build MySQL-specific options if applicable
  const connectionConfig =
    client === 'mysql' || client === 'mysql2'
      ? typeof connection === 'string'
        ? connection
        : {
            ...connection,
            charset: 'utf8mb4',
            timezone: 'Z',
          }
      : connection;

  return {
    client,
    connection: connectionConfig,
    pool: {
      min: isProd ? env.PROD_DB_POOL_MIN : env.DEV_DB_POOL_MIN,
      max: isProd ? env.PROD_DB_POOL_MAX : env.DEV_DB_POOL_MAX,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
    acquireConnectionTimeout: 10000,
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  };
};

/**
 * Create database connection
 */
export const db = knex(getConfig());

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    const config = getConfig();
    logger.info(
      {
        environment: env.NODE_ENV,
        client: config.client,
        database: typeof config.connection === 'string' ? 'URL' : config.connection.database,
      },
      'Database connection established successfully'
    );
    return true;
  } catch (error) {
    logger.error(
      {
        error: error.message,
        environment: env.NODE_ENV,
      },
      'Failed to connect to database'
    );
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeConnections = async () => {
  await db.destroy();
  logger.info('Database connection closed');
};

export default db;
