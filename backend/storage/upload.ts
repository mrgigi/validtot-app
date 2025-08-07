import { api, APIError } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imagesBucket = new Bucket("validtot-images", {
  public: true,
});

interface UploadUrlRequest {
  filename: string;
  contentType: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

// Generates a signed upload URL for image uploads.
export const getUploadUrl = api<UploadUrlRequest, UploadUrlResponse>(
  { expose: true, method: "POST", path: "/storage/upload-url" },
  async ({ filename, contentType }) => {
    // Validate content type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      throw APIError.invalidArgument("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.");
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    const uniqueFilename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    try {
      const { url: uploadUrl } = await imagesBucket.signedUploadUrl(uniqueFilename, {
        ttl: 3600, // 1 hour
      });

      const publicUrl = imagesBucket.publicUrl(uniqueFilename);

      return {
        uploadUrl,
        publicUrl,
      };
    } catch (error) {
      throw APIError.internal("Failed to generate upload URL");
    }
  }
);
