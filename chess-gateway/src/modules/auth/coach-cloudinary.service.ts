import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { UploadService } from '../cloudinary/upload.service';

// CLOUDINARY ENVIRONMENT
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

@Injectable()
export class CoachCloudinaryService {
  constructor(private readonly uploadService: UploadService) {}

  async storeFilesInCloudinary(pathFiles: string[]): Promise<string[]> {
    try {
      let postNewFilePromises: Promise<any>[] = [];
      pathFiles.forEach((path) => {
        postNewFilePromises.push(this.uploadService.postNewFile(path));
      });

      const secureUrlsFromCloudinary = await Promise.all(postNewFilePromises);

      // public urls
      return secureUrlsFromCloudinary;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
