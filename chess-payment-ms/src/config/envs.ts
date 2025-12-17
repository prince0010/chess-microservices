import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  PAYMENT_CONTAINER_NAME: string;
  MARIADB_VERSION: string;
  PAYMENT_MARIADB_CONTAINER_NAME: string;
  PAYMENT_DB_PORT: number;
  PAYMENT_DB_HOST: string;
  PAYMENT_DB_NAME: string;
  PAYMENT_DB_ROOT_PASSWORD: string;
  PAYMENT_DB_USERNAME: string;
  PAYMENT_DB_PASSWORD: string;
  // stripe
  STRIPE_SECRET_API_KEY: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_ENDPOINT_SECRET: string;
  // In app purchase
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  ANDROID_PACKAGE_NAME: string;
  APPLE_IN_APP_PURCHASE_KEY: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PAYMENT_CONTAINER_NAME: joi.string().required(),
    MARIADB_VERSION: joi.string().required(),
    PAYMENT_MARIADB_CONTAINER_NAME: joi.string().required(),
    PAYMENT_DB_PORT: joi.number().required(),
    PAYMENT_DB_HOST: joi.string().required(),
    PAYMENT_DB_NAME: joi.string().required(),
    PAYMENT_DB_ROOT_PASSWORD: joi.string().required(),
    PAYMENT_DB_USERNAME: joi.string().required(),
    PAYMENT_DB_PASSWORD: joi.string().required(),
    NATS_SERVERS: joi.string().required(),
    // stripe
    STRIPE_SECRET_API_KEY: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    // In app purchase
    GOOGLE_SERVICE_ACCOUNT_JSON: joi.string().required(),
    ANDROID_PACKAGE_NAME: joi.string().required(),
    APPLE_IN_APP_PURCHASE_KEY: joi.string().required(),
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
  paymentContainerName: envVars.PAYMENT_CONTAINER_NAME,
  mariadbVersion: envVars.MARIADB_VERSION,
  mariadbContainerName: envVars.PAYMENT_MARIADB_CONTAINER_NAME,
  dbPaymentPort: envVars.PAYMENT_DB_PORT,
  dbPaymentHost: envVars.PAYMENT_DB_HOST,
  dbPaymentName: envVars.PAYMENT_DB_NAME,
  dbPaymentRootPassword: envVars.PAYMENT_DB_ROOT_PASSWORD,
  dbPaymentUsername: envVars.PAYMENT_DB_USERNAME,
  dbPaymentPassword: envVars.PAYMENT_DB_PASSWORD,
  // stripe
  stripeSecretApiKey: envVars.STRIPE_SECRET_API_KEY,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
  stripeEndpointSecret: envVars.STRIPE_ENDPOINT_SECRET,
  // In app purchase
  googleServiceAccountJson: envVars.GOOGLE_SERVICE_ACCOUNT_JSON,
  androidPackageName: envVars.ANDROID_PACKAGE_NAME,
  appleInAppPurchaseKey: envVars.APPLE_IN_APP_PURCHASE_KEY,
};
