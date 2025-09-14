import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { StartBatchDto } from './dto/start-batch.dto';
import { ApiResponse, ErrorResponse } from 'src/common/dto/response.dto';
import { BatchCallDatResponse } from 'src/external-apis/elevenlabs/dto/get-batch-call.dto';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get('upload-url')
  async generateUploadUrl(
    @Query('fileName') fileName: string,
    @Request() req: any,
  ): Promise<any> {
    if (!fileName) {
      throw new BadRequestException('File name is required');
    }

    if (!req.user || !req.user.id) {
      throw new BadRequestException('User ID is required');
    }

    const userId: string = req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.batchService.generateCsvUploadUrl(fileName, userId);
  }

  @Post('create')
  async create(
    @Body() req,
  ): Promise<ApiResponse<BatchCallDatResponse> | ErrorResponse> {
    try {
      const batchData: StartBatchDto = StartBatchDto.toJson(req);
      const batchResult = await this.batchService.create(batchData);

      return {
        success: true,
        data: batchResult,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
