import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { DynamoDbService } from 'src/external-apis/aws/dynamo-db/dynamo-db.service';
import { ApiKeyResponseDto } from './dto/api-key.dto';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(private readonly dynamoDBService: DynamoDbService) {}

  async generateApiKey(userId: string, keyName: string): Promise<string> {
    try {
      if (!userId) {
        this.logger.error('UserId is not provided');
        throw new BadRequestException(
          'User is not authorized to access the service',
        );
      }

      if (!keyName || keyName.length < 1) {
        this.logger.error('Keyname is required');
        throw new BadRequestException('Key name is missing');
      }

      const apiKey = crypto.randomBytes(32).toString('hex');
      const timestamp = Date.now();
      const keyId = crypto.randomBytes(8).toString('hex');

      const fullApiKey = `junno_${keyId}_${timestamp}_${apiKey}`;

      // TODO : Add expiry date handling
      const apiKeyData = {
        id: keyId,
        userId,
        keyName,
        apiKey: fullApiKey,
        createdAt: new Date(timestamp).toISOString(),
        isActive: true,
        lastUsed: null,
        expiryDate: null, // Optional, can be set later
      };

      await this.dynamoDBService.putItem('api', apiKeyData);

      this.logger.log(
        `API key generated and saved for user: ${userId}, keyName: ${keyName}`,
      );

      return fullApiKey;
    } catch (error) {
      this.logger.error('Error generating API key:', error);
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      if (!apiKey) {
        this.logger.error('API key is not provided');
        return false;
      }

      // Basic format validation
      if (!apiKey.startsWith('junno_')) {
        this.logger.error('Invalid API key format');
        return false;
      }

      // Extract keyId from API key
      const parts = apiKey.split('_');
      if (parts.length !== 4) {
        this.logger.error('Invalid API key structure');
        return false;
      }

      const keyId = parts[1];

      // Database validation - if it exists and matches, it's valid
      const apiKeyData: ApiKeyResponseDto | null =
        await this.dynamoDBService.getItem('api', { id: keyId });

      if (!apiKeyData) {
        this.logger.error('API key not found in database');
        return false;
      }

      if (apiKeyData.apiKey !== apiKey) {
        this.logger.error('API key does not match database record');
        return false;
      }

      if (!apiKeyData.isActive) {
        this.logger.error('API key is inactive');
        return false;
      }

      if (apiKeyData.expiryDate) {
        const expiryDate = new Date(apiKeyData.expiryDate);
        const currentDate = new Date();

        if (currentDate > expiryDate) {
          this.logger.error('API key has expired');
          return false;
        }
      }

      this.logger.log('API key validation successful');
      return true;
    } catch (error) {
      this.logger.error('Error validating API key:', error);
      return false;
    }
  }
}
