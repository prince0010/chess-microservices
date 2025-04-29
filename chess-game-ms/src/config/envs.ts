import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  GAME_CONTAINER_NAME: string;
  MARIADB_VERSION: string;
  GAME_MARIADB_CONTAINER_NAME: string;
  GAME_DB_PORT: number;
  GAME_DB_HOST: string;
  GAME_DB_NAME: string;
  GAME_DB_ROOT_PASSWORD: string;
  GAME_DB_USERNAME: string;
  GAME_DB_PASSWORD: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    GAME_CONTAINER_NAME: joi.string().required(),
    MARIADB_VERSION: joi.string().required(),
    GAME_MARIADB_CONTAINER_NAME: joi.string().required(),
    GAME_DB_PORT: joi.number().required(),
    GAME_DB_HOST: joi.string().required(),
    GAME_DB_NAME: joi.string().required(),
    GAME_DB_ROOT_PASSWORD: joi.string().required(),
    GAME_DB_USERNAME: joi.string().required(),
    GAME_DB_PASSWORD: joi.string().required(),
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
  gameContainerName: envVars.GAME_CONTAINER_NAME,
  mariadbVersion: envVars.MARIADB_VERSION,
  mariadbContainerName: envVars.GAME_MARIADB_CONTAINER_NAME,
  dbGamePort: envVars.GAME_DB_PORT,
  dbGameHost: envVars.GAME_DB_HOST,
  dbGameName: envVars.GAME_DB_NAME,
  dbGameRootPassword: envVars.GAME_DB_ROOT_PASSWORD,
  dbGameUsername: envVars.GAME_DB_USERNAME,
  dbGamePassword: envVars.GAME_DB_PASSWORD,
};
