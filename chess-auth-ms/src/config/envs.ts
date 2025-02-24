import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  AUTH_CONTAINER_NAME: string;
  MARIADB_VERSION: string;
  AUTH_MARIADB_CONTAINER_NAME: string;
  AUTH_DB_PORT: number;
  AUTH_DB_HOST: string;
  AUTH_DB_NAME: string;
  AUTH_DB_ROOT_PASSWORD: string;
  AUTH_DB_USERNAME: string;
  AUTH_DB_PASSWORD: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    AUTH_CONTAINER_NAME: joi.string().required(),
    MARIADB_VERSION: joi.string().required(),
    AUTH_MARIADB_CONTAINER_NAME: joi.string().required(),
    AUTH_DB_PORT: joi.number().required(),
    AUTH_DB_HOST: joi.string().required(),
    AUTH_DB_NAME: joi.string().required(),
    AUTH_DB_ROOT_PASSWORD: joi.string().required(),
    AUTH_DB_USERNAME: joi.string().required(),
    AUTH_DB_PASSWORD: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    NATS_SERVERS: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  authContainerName: envVars.AUTH_CONTAINER_NAME,
  mariadbVersion: envVars.MARIADB_VERSION,
  mariadbContainer_name: envVars.AUTH_MARIADB_CONTAINER_NAME,
  dbAuthPort: envVars.AUTH_DB_PORT,
  dbAuthHost: envVars.AUTH_DB_HOST,
  dbAuthName: envVars.AUTH_DB_NAME,
  dbAuthRootPassword: envVars.AUTH_DB_ROOT_PASSWORD,
  dbAuthUsername: envVars.AUTH_DB_USERNAME,
  dbAuthPassword: envVars.AUTH_DB_PASSWORD,
  jwtSecret: envVars.JWT_SECRET,
};
