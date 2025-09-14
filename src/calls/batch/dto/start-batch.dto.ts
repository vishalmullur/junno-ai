import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInputDto } from './contact-input.dto';
import { Type } from 'class-transformer';

export class StartBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInputDto)
  contacts: ContactInputDto[];

  @IsString()
  @IsNotEmpty()
  batch_name: string;

  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @IsString()
  @IsNotEmpty()
  agent_phone_number_id: string;

  @IsNotEmpty()
  file_key: string;

  @IsNumber()
  schedule_at: number;

  static toJson(data: any): StartBatchDto {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided');
    }
    return {
      contacts: data.contacts,
      batch_name: data.batch_name,
      agent_id: data.agent_id,
      agent_phone_number_id: data.agent_phone_number_id,
      schedule_at: data.schedule_at,
      file_key: data.file_key,
    } as StartBatchDto;
  }
}
