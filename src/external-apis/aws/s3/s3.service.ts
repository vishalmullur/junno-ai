import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3UploadUrlDto, S3UploadUrlResponse } from './dto/s3-upload.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string | undefined;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!accessKeyId || !secretAccessKey || !this.bucketName) {
      this.logger.error(
        'AWS credentials or bucket name are not set in the environment variables.',
      );
      throw new Error(
        'AWS credentials or bucket name are not set in the environment variables.',
      );
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`S3 Client initialized for bucket: ${this.bucketName}`);
  }

  async generateUploadUrl(
    uploadDto: S3UploadUrlDto,
  ): Promise<S3UploadUrlResponse> {
    try {
      const timeStamp = new Date().toISOString();
      const key = `${uploadDto.userId}/${uploadDto.folderPath}/${uploadDto.fileName}_${timeStamp}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: uploadDto.contentType,
        Metadata: {
          originalName: uploadDto.fileName,
          uploadedBy: uploadDto.userId,
        },
      });

      const expiresIn: number = 900;
      const expiresAt = Date.now() + expiresIn * 1000;

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresIn,
      });

      return {
        url: uploadUrl,
        key: key,
        bucket: this.bucketName,
        expiresIn: expiresIn,
        expiresAt: expiresAt,
      };
    } catch (error) {
      this.logger.error('Error generating S3 upload URL:', error);
      throw new InternalServerErrorException(
        'Failed to generate S3 upload URL. Please try again later.',
      );
    }
  }

  // async uploadFile(uploadDto: S3UploadDto): Promise<void> {
  //   try {
  //     const timeStamp = new Date().toISOString().split('T')[0];
  //     const uniqueFileName = `${uploadDto.fileName}_${new Date().toISOString()}`;
  //     const key = uploadDto.folderPath
  //       ? `${uploadDto.folderPath}/${timeStamp}/${uniqueFileName}`
  //       : ``;

  //     const command = new PutObjectCommand({
  //       Bucket: this.bucketName,
  //       Key: key,
  //       Body: uploadDto.fileContent,
  //       ContentType: uploadDto.contentType,
  //       ACL: uploadDto.isPublic ? 'public-read' : 'private',
  //       Metadata: {
  //         originalName: uploadDto.fileName,
  //         uploadedAt: new Date().toISOString(),
  //         ...uploadDto.metadata,
  //       },
  //     });

  //     const uploadResult = await this.s3Client.send(command);

  //     this.logger.debug('File upload result:', uploadResult);
  //   } catch (error) {
  //     this.logger.error('Error uploading file to S3:', error);
  //     throw new InternalServerErrorException(
  //       'Failed to upload file to S3. Please try again later.',
  //     );
  //   }
  // }

  async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      return url;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFileContent(fileKey: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new InternalServerErrorException('File not found or empty');
      }

      const stream = response.Body as ReadableStream;
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks).toString('utf-8');
    } catch (error) {
      this.logger.error(`Error getting file content: ${error}`);
      throw new InternalServerErrorException(
        `Failed to get file content: ${error.message}`,
      );
    }
  }
}
