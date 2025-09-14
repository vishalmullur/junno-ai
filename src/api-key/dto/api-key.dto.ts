import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  keyName: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class ApiKeyResponseDto {
  id: string;
  userId: string;
  keyName: string;
  apiKey: string;
  createdAt: string;
  expiryDate?: string;
  isActive: boolean;
  lastUsed?: string;
}
