import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  async uploadFile(pathUrl: string): Promise<any> {
    const options: UploadApiOptions = {
      resource_type: 'auto',
    };

    return new Promise((resolve, reject) => {
      fs.readFile(pathUrl, (err, data) => {
        if (err) {
          return reject(err);
        }

        // Process the image using Sharp
        sharp(data)
          .webp({ quality: 80 }) // save storage
          .toBuffer()
          .then((processedBuffer) => {
            // Upload the processed image buffer to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
              options,
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              },
            );

            uploadStream.end(processedBuffer);
          })
          .catch((sharpError) => {
            reject(sharpError);
          });
      });
    });
  }
}
