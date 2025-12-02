import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  async uploadFile(pathUrl: string): Promise<any> {
    const options: UploadApiOptions = {
      resource_type: 'auto',
    };

    return new Promise((resolve, reject) => {
      fs.readFile(pathUrl, async (err, fileBuffer) => {
        if (err) return reject(err);

        const ext = path.extname(pathUrl).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);

        let uploadBuffer: Buffer;

        try {
          if (isImage) {
            // Process ONLY images using Sharp
            uploadBuffer = await sharp(fileBuffer)
              .webp({ quality: 80 })
              .toBuffer();
          } else {
            // Non-image files → upload raw
            uploadBuffer = fileBuffer;
          }
        } catch (err) {
          return reject(new Error('Sharp processing failed: ' + err.message));
        }

        // Cloudinary upload
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        uploadStream.end(uploadBuffer);
      });
    });
  }
}
