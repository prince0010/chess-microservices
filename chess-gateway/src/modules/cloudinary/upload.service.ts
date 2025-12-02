import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { CloudinaryService } from './cloudinary.service';

// CLOUDINARY ENVIRONMENT
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  public async postNewFile(path: string): Promise<any> {
    const divisionPath = path.split('/');
    const relativePath = divisionPath[divisionPath.length - 1];
    const pathFromFs = this.getStaticFile(relativePath);

    return this.cloudinaryService
      .uploadFile(pathFromFs)
      .then((file) => {
        const { secure_url } = file;
        return secure_url;
      })
      .catch((error) => {
        console.error(
          'Error in Catch Cloudinary Service uploadFile method: ',
          error,
        );
        throw new InternalServerErrorException(
          'En error has occurred uploading file',
        );
      })
      .finally(() => {
        // DELETE file from uploads
        this.deleteFileFromFs(pathFromFs);
      });
  }

  public getStaticFile(fileName: string): string {
    const path = join(`/usr/src/app/uploads`, fileName); // create a physic path to get image name if it exists

    if (!existsSync(path)) {
      throw new BadGatewayException(`No file found with path ${fileName}`);
    }
    // if image with that name exists return that name
    return path;
  }

  public deleteFileFromFs(path: string): void {
    try {
      unlinkSync(path);
    } catch (err) {
      console.error(`Failed to delete file ${path}`, err);
    }
  }

  // in case the creation or updating a product fail, I need to remove the image from fs
  public removeImageFromFS(pathOrFilename: string) {
    let fullPath = pathOrFilename;

    // If input is just filename, build full path
    if (!pathOrFilename.includes('/usr/src/app/uploads')) {
      fullPath = join('/usr/src/app/uploads', pathOrFilename);
    }

    if (existsSync(fullPath)) {
      this.deleteFileFromFs(fullPath);
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  }
}
