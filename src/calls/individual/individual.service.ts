import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ElevenlabsService } from 'src/external-apis/elevenlabs/elevenlabs.service';
import { CreateOutboundCallDto } from '../../external-apis/elevenlabs/dto/create-outbound-call.dto';
import { OutgoingCallDto } from 'src/external-apis/elevenlabs/dto/initiate-outgoing-call.dto';

@Injectable()
export class IndividualService {
  private readonly logger: Logger = new Logger(IndividualService.name);
  constructor(private readonly elevenlabs: ElevenlabsService) {}
  // Initiates a call to the given number for the specified organization
  initiateCall(number: string): Promise<OutgoingCallDto> {
    try {
      if (!number && number.length > 9) {
        this.logger.error('Phone number is missing');
        throw new BadRequestException(
          'Invalid number, please check once again',
        );
      }

      const data: CreateOutboundCallDto = {
        agent_id: process.env.ELEVENLABS_AGENT_ID || '',
        agent_phone_number_id: process.env.ELEVEN_LAB_PHONE_NUMBER_ID || '',
        to_number: number,
      };

      return this.elevenlabs.makeOutgoingCall(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to create batch call. ${error.message}`,
      );
    }
  }

  // Retrieves the call history for the specified organization
  async getCallHistory(org_id: string): Promise<void> {}

  // Retrieves the details of a specific call by its ID for the specified organization
  async getCallDetails(callId: string, org_id: string): Promise<void> {}
}
