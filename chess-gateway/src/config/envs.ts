import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  REDIS_PASSWORD: string;
  CLOUDINARY_USERNAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.string().required(),
    REDIS_PASSWORD: joi.string().required(),
    CLOUDINARY_USERNAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    CLOUDINARY_URL: joi.string().required(),
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
  redisPassword: envVars.REDIS_PASSWORD,
  cloudinaryUsername: envVars.CLOUDINARY_USERNAME,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  cloudinaryUrl: envVars.CLOUDINARY_URL,
};
