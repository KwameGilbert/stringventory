import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root (2 levels up from src/config)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration schema with Zod validation
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_DEBUG: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  PORT: z.string().default('3000').transform(Number),
  HOST: z.string().default('0.0.0.0'),

  // Database - Dev
  DEV_DB_CLIENT: z.enum(['pg', 'mysql', 'mysql2', 'sqlite3']).default('pg'),
  DEV_DATABASE_URL: z.string().optional(),
  DEV_DB_HOST: z.string().default('localhost'),
  DEV_DB_PORT: z.string().default('5432').transform(Number),
  DEV_DB_NAME: z.string().default('stringventory_dev'),
  DEV_DB_USER: z.string().default('postgres'),
  DEV_DB_PASSWORD: z.string().default(''),
  DEV_DB_POOL_MIN: z.string().default('2').transform(Number),
  DEV_DB_POOL_MAX: z.string().default('10').transform(Number),

  // Database - Production
  PROD_DB_CLIENT: z.enum(['pg', 'mysql', 'mysql2', 'sqlite3']).default('pg'),
  PROD_DATABASE_URL: z.string().optional(),
  PROD_DB_HOST: z.string().optional(),
  PROD_DB_PORT: z.string().default('5432').transform(Number),
  PROD_DB_NAME: z.string().optional(),
  PROD_DB_USER: z.string().optional(),
  PROD_DB_PASSWORD: z.string().default(''),
  PROD_DB_POOL_MIN: z.string().default('2').transform(Number),
  PROD_DB_POOL_MAX: z.string().default('20').transform(Number),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Security
  HASH_ALGORITHM: z.enum(['bcrypt', 'scrypt', 'pbkdf2', 'argon2']).default('bcrypt'),
  BCRYPT_ROUNDS: z.string().default('12').transform(Number),
  HASH_KEY_LENGTH: z.string().default('64').transform(Number),
  HASH_SALT_LENGTH: z.string().default('16').transform(Number),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // Upload
  UPLOAD_STRATEGY: z.enum(['local', 'cloudinary']).default('local'),
  UPLOAD_LOCAL_PATH: z.string().default('uploads'),
  UPLOAD_MAX_FILE_SIZE: z.string().default('5242880').transform(Number),
  UPLOAD_MAX_IMAGE_SIZE: z.string().default('5242880').transform(Number),
  UPLOAD_MAX_DOCUMENT_SIZE: z.string().default('10485760').transform(Number),
  UPLOAD_MAX_VIDEO_SIZE: z.string().default('52428800').transform(Number),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default('uploads'),

  // Email
  EMAIL_PROVIDER: z.string().default('smtp'),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v) : undefined)),
  EMAIL_SECURE: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // App
  APP_NAME: z.string().default('Express Backend'),
  API_VERSION: z.string().default('v1'),
});

/**
 * Parse and validate environment variables
 */
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
export const isDebug = env.APP_DEBUG;

export default env;
