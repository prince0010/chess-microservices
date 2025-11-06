import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  LESSON_CONTAINER_NAME: string;
  MARIADB_VERSION: string;
  LESSON_MARIADB_CONTAINER_NAME: string;
  LESSON_DB_PORT: number;
  LESSON_DB_HOST: string;
  LESSON_DB_NAME: string;
  LESSON_DB_ROOT_PASSWORD: string;
  LESSON_DB_USERNAME: string;
  LESSON_DB_PASSWORD: string;
  TRANSLATION_API_KEY: string;
  REDIS_PASSWORD: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    LESSON_CONTAINER_NAME: joi.string().required(),
    MARIADB_VERSION: joi.string().required(),
    LESSON_MARIADB_CONTAINER_NAME: joi.string().required(),
    LESSON_DB_PORT: joi.number().required(),
    LESSON_DB_HOST: joi.string().required(),
    LESSON_DB_NAME: joi.string().required(),
    LESSON_DB_ROOT_PASSWORD: joi.string().required(),
    LESSON_DB_USERNAME: joi.string().required(),
    LESSON_DB_PASSWORD: joi.string().required(),
    NATS_SERVERS: joi.string().required(),
    TRANSLATION_API_KEY: joi.string().required(),
    REDIS_PASSWORD: joi.string().required(),
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
  lessonContainerName: envVars.LESSON_CONTAINER_NAME,
  mariadbVersion: envVars.MARIADB_VERSION,
  mariadbContainerName: envVars.LESSON_MARIADB_CONTAINER_NAME,
  dbLessonPort: envVars.LESSON_DB_PORT,
  dbLessonHost: envVars.LESSON_DB_HOST,
  dbLessonName: envVars.LESSON_DB_NAME,
  dbLessonRootPassword: envVars.LESSON_DB_ROOT_PASSWORD,
  dbLessonUsername: envVars.LESSON_DB_USERNAME,
  dbLessonPassword: envVars.LESSON_DB_PASSWORD,
  translationApiKey: envVars.TRANSLATION_API_KEY,
  redisPassword: envVars.REDIS_PASSWORD,
};
