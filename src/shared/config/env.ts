import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT: number;
  MONGO_URI: string;
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  API_VERSION: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

export const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: required('MONGO_URI'),
  NODE_ENV: (process.env.NODE_ENV as Config['NODE_ENV']) || 'development',
  APP_NAME: required('APP_NAME') || 'Express TS Boilerplate',
  API_VERSION: required('API_VERSION') || 'v1',
  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
};
