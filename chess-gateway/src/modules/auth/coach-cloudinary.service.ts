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

  // for update endpoint where is needed remove old files
  async updateFilesInCloudinary(
    oldUrls: string[],
    pathFiles: string[],
  ): Promise<string[]> {
    try {
      // Remove olds file from Cloudinary
      for (const url of oldUrls) {
        let arrName = url.split('/');
        let name = arrName[arrName.length - 1];
        let [public_id] = name.split('.');
        cloudinary.uploader.destroy(public_id);
      }

      return await this.storeFilesInCloudinary(pathFiles);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
