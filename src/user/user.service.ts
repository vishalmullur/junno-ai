import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ApiKeyResponseDto } from 'src/api-key/dto/api-key.dto';
import { DynamoDbService } from 'src/external-apis/aws/dynamo-db/dynamo-db.service';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly dynamoDBService: DynamoDbService) {}

  async findByApiKey(apiKey: string): Promise<UserResponseDto> {
    try {
      if (!apiKey) {
        this.logger.error('API key is not provided');
        throw new NotFoundException('API key is required');
      }

      const apiKeyRecord: ApiKeyResponseDto | null =
        await this.dynamoDBService.getItem('api', {
          apiKey: apiKey,
        });

      if (!apiKeyRecord || !apiKeyRecord.isActive) {
        this.logger.error('API key not found or inactive');
        throw new NotFoundException('Invalid or inactive API key');
      }

      const userRecord: UserResponseDto | null =
        await this.dynamoDBService.getItem('user', {
          id: apiKeyRecord.userId,
        });

      if (!userRecord) {
        this.logger.error('User not found for API key');
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User found for API key: ${apiKeyRecord.userId}`);
      return userRecord;
    } catch (error) {
      this.logger.error('Error finding user by API key:', error);
      throw error;
    }
  }
}
