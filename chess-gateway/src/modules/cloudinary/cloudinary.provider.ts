import { ConfigOptions, v2 } from 'cloudinary';
import { envs } from 'src/config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',

  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: envs.cloudinaryUsername,
      api_key: envs.cloudinaryApiKey,
      api_secret: envs.cloudinaryApiSecret,
    });
  },
};
