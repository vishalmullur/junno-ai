export interface S3UploadDto {
  fileName: string;
  fileContent: Buffer;
  contentType: string;
  isPublic: boolean;
  folderPath?: string;
  metadata?: Record<string, string>;
}

export interface S3UploadUrlDto {
  fileName: string;
  userId: string;
  folderPath: string;
  contentType: string;
  isPublic: boolean;
}

export interface S3UploadUrlResponse {
  url: string;
  key: string;
  bucket?: string;
  expiresAt: number;
  expiresIn: number;
}
