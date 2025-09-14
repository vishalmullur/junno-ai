import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// Import or define CreateBatchCallDto
import { CreateBatchCallDto } from './dto/create-batch-call.dto';
import { CreateOutboundCallDto } from './dto/create-outbound-call.dto';
import { BatchCallDatResponse } from './dto/get-batch-call.dto';
import { OutgoingCallDto } from './dto/initiate-outgoing-call.dto';

@Injectable()
export class ElevenlabsService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly timeout: number; // 30 seconds
  private readonly logger = new Logger(ElevenlabsService.name);

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
    this.apiUrl =
      process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io/v1';
    this.timeout = 30000; // 30 seconds
  }

  async submitBatchCall(
    batchCallData: CreateBatchCallDto,
  ): Promise<BatchCallDatResponse> {
    console.log(
      'Submitting batch call with data:',
      JSON.stringify(batchCallData),
    );

    const url = `${this.apiUrl}/convai/batch-calling/submit`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchCallData),
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseData = await response.json();

    if (!response.ok) {
      throw new HttpException(
        `${JSON.stringify(responseData)}`,
        response.status || HttpStatus.BAD_REQUEST,
      );
    }

    return responseData as BatchCallDatResponse;

    console.log('Batch call submitted successfully:', responseData);
  }

  async makeOutgoingCall(
    createOutboundCallDto: CreateOutboundCallDto,
  ): Promise<OutgoingCallDto> {
    try {
      this.logger.debug(
        'Making outgoing call with data:',
        JSON.stringify(createOutboundCallDto),
      );
      const url = `${this.apiUrl}/convai/twilio/outbound-call`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createOutboundCallDto),
        signal: AbortSignal.timeout(30000),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const responseData = await response.json();

      if (!response.ok) {
        throw new HttpException(
          `${JSON.stringify(responseData)}`,
          response.status || HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.debug('Outgoing call made successfully:', responseData);

      return responseData as OutgoingCallDto;
    } catch (error) {
      this.logger.error('Error making outgoing call:', error);
      throw new HttpException(
        'Error making outgoing call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
