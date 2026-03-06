import { v2 as cloudinary } from "cloudinary";

export type UploadFile = {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => NodeJS.ReadableStream;
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to determine resource type
const getResourceType = (mimetype: string): 'image' | 'raw' => {
    if (mimetype.includes('pdf') ||
        mimetype.includes('msword') ||
        mimetype.includes('vnd.openxmlformats')) {
        return 'raw';
    }
    return 'image';
};

export const uploadToCloudinary = async (file: UploadFile, folder: string) => {
    return new Promise<string>((resolve, reject) => {
        const { createReadStream, filename, mimetype } = file;

        // Determine resource type based on MIME type
        const resourceType = getResourceType(mimetype);

        // Clean the filename - remove duplicate extensions
        const cleanFilename = cleanDuplicateExtensions(filename);

        const uploadOptions: any = {
            folder,
            public_id: cleanFilename, // Use the cleaned filename
            resource_type: resourceType,
        };

        // Add format-specific options
        if (resourceType === 'raw') {
            uploadOptions.allowed_formats = ['pdf', 'doc', 'docx'];
        } else {
            uploadOptions.allowed_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        }

        console.log('📁 Cloudinary upload:', {
            originalFilename: filename,
            cleanFilename,
            resourceType,
            folder
        });

        const stream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error || !result) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error || new Error('Upload failed'));
                }
                console.log('✅ Cloudinary upload successful:', result.secure_url);
                resolve(result.secure_url);
            }
        );

        createReadStream().pipe(stream);
    });
};

const cleanDuplicateExtensions = (filename: string): string => {
    const parts = filename.split('.');

    if (parts.length < 3) {
        return filename;
    }

    const lastExt = parts[parts.length - 1].toLowerCase();
    const secondLastExt = parts[parts.length - 2].toLowerCase();

    const commonExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (commonExtensions.includes(lastExt) && commonExtensions.includes(secondLastExt) && lastExt === secondLastExt) {
        return parts.slice(0, -1).join('.');
    }

    return filename;
};