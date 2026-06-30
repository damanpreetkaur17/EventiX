import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "./env.js";

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

export function uploadImageBuffer(
  buffer: Buffer,
  options: { folder: string; publicId?: string },
): Promise<UploadApiResponse> {
  if (!env.cloudinary.enabled) {
    return Promise.reject(new Error("Cloudinary is not configured"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
}
