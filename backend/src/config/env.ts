import dotenv from 'dotenv';

dotenv.config();

const envSchema = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '8h',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
};

function requireEnv(name: keyof typeof envSchema): string {
  const v = envSchema[name];
  if (v === undefined || v === '') {
    throw new Error(`Missing required environment variable: ${String(name)}`);
  }
  return String(v);
}

/** Validated configuration — fails fast on boot if secrets are missing */
export const env = {
  nodeEnv: envSchema.NODE_ENV,
  port: envSchema.PORT,
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: envSchema.JWT_EXPIRES_IN,
  corsOrigin: envSchema.CORS_ORIGIN,
};
