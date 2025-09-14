import { Controller, Get, Param } from '@nestjs/common';
import { IndividualService } from './individual.service';
import { ApiResponse, ErrorResponse } from 'src/common/dto/response.dto';
import { OutgoingCallDto } from 'src/external-apis/elevenlabs/dto/initiate-outgoing-call.dto';

@Controller('individual')
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @Get('initiate-call/:number')
  async initiateCall(
    @Param('number') number: string,
  ): Promise<ApiResponse<OutgoingCallDto> | ErrorResponse> {
    try {
      const response = await this.individualService.initiateCall(number);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
