/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as Papa from 'papaparse';
import { StartBatchDto } from './dto/start-batch.dto';
import { ContactsTransformer } from './transformer/contacts.transformer';
import { ElevenlabsService } from 'src/external-apis/elevenlabs/elevenlabs.service';
import { S3Service } from 'src/external-apis/aws/s3/s3.service';
import { S3UploadDto } from 'src/external-apis/aws/s3/dto/s3-upload.dto';
import { CreateBatchCallDto } from 'src/external-apis/elevenlabs/dto/create-batch-call.dto';
import { BatchCallDatResponse } from 'src/external-apis/elevenlabs/dto/get-batch-call.dto';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);
  constructor(
    private readonly contactsTransformer: ContactsTransformer,
    private readonly elevenlabs: ElevenlabsService,
    private readonly s3Service: S3Service,
  ) {}

  async generateCsvUploadUrl(fileName: string, userId: string): Promise<any> {
    try {
      if (!fileName.toLowerCase().endsWith('.csv')) {
        throw new BadRequestException('File name must end with .csv');
      }

      const uploadUrlData = await this.s3Service.generateUploadUrl({
        fileName,
        userId,
        contentType: 'text/csv',
        folderPath: 'instant-calls/csv-uploads',
        isPublic: false,
      });

      return { success: true, ...uploadUrlData };
    } catch (error) {
      this.logger.error(`Error generating CSV upload URL: ${error}`);
      throw new BadRequestException(
        `Failed to generate CSV upload URL: ${error.message}`,
      );
    }
  }

  async getFileContent(fileKey: string): Promise<any> {
    try {
      const fileContent = await this.s3Service.getFileContent(fileKey);
      if (!fileContent) {
        throw new BadRequestException('File not found or empty');
      }

      const parsedResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => header.trim().toLowerCase(),
      });

      return parsedResult.data;
    } catch (error) {
      this.logger.error(`Error getting file content: ${error}`);
      throw new BadRequestException(
        `Failed to get file content: ${error.message}`,
      );
    }
  }

  async create(startBatchDto: StartBatchDto): Promise<BatchCallDatResponse> {
    try {
      if (!startBatchDto.contacts || startBatchDto.contacts.length === 0) {
        throw new BadRequestException('Contacts array cannot be empty');
      }

      if (!startBatchDto.agent_id) {
        throw new BadRequestException('Agent ID is required');
      }

      const createBatchCallDto: CreateBatchCallDto =
        this.contactsTransformer.transformContactsToRecipients(startBatchDto);

      const eleventhlabsResponse =
        await this.elevenlabs.submitBatchCall(createBatchCallDto);

      if (!eleventhlabsResponse || !eleventhlabsResponse.id) {
        throw new BadRequestException('Failed to create batch call');
      }

      this.logger.log(
        `Batch call created successfully: ${eleventhlabsResponse.id}`,
      );

      return eleventhlabsResponse;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to create batch call. ${error.message}`,
      );
    }
  }
}
