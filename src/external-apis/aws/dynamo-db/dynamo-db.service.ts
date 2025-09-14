import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TableName } from './dynamo-table.const';

@Injectable()
export class DynamoDbService {
  private readonly logger = new Logger(DynamoDbService.name);
  private readonly dynamoClient: DynamoDBClient;
  private readonly env: string;

  constructor(private configService: ConfigService) {
    this.env = this.configService.get<string>('ENV') || 'dev';
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('AWS configuration is missing required values');
    }

    this.dynamoClient = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    this.logger.log(`DynamoDB client initialized with table prefix`);
  }

  async getItem<T>(
    table: keyof typeof TableName,
    key: Record<string, any>,
  ): Promise<T | null> {
    try {
      const dynamoKey: Record<string, any> = {};

      for (const [keyName, value] of Object.entries(key)) {
        if (typeof value === 'string') {
          dynamoKey[keyName] = { S: value };
        } else if (typeof value === 'number') {
          dynamoKey[keyName] = { N: value.toString() };
        } else if (typeof value === 'boolean') {
          dynamoKey[keyName] = { BOOL: value };
        } else {
          dynamoKey[keyName] = { S: String(value) };
        }
      }

      const getSingleCommand = new GetItemCommand({
        TableName: `${this.env}_${TableName[table]}`,
        Key: dynamoKey,
      });

      const response = await this.dynamoClient.send(getSingleCommand);

      if (!response.Item) {
        return null;
      }

      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(response.Item)) {
        if (value.S) result[key] = value.S;
        else if (value.N) result[key] = Number(value.N);
        else if (value.BOOL !== undefined) result[key] = value.BOOL;
        else if (value.NULL) result[key] = null;
        else result[key] = value;
      }

      return result as T;
    } catch (error) {
      this.logger.error(
        `Error getting item from ${table}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async getItemByPrimaryKey<T>(
    table: keyof typeof TableName,
    key: string,
    keyName: string = 'id',
  ): Promise<T | null> {
    try {
      const getSingleCommand = new GetItemCommand({
        TableName: TableName[table],
        Key: {
          [keyName]: { S: key },
        },
      });

      const response = await this.dynamoClient.send(getSingleCommand);

      if (!response.Item) {
        return null;
      }

      return response.Item as T;
    } catch (error) {
      this.logger.error(
        `Error getting item from ${table}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async putItem(
    table: keyof typeof TableName,
    item: Record<string, any>,
  ): Promise<void> {
    try {
      const putCommand = new PutItemCommand({
        TableName: `${this.env}_${TableName[table]}`,
        Item: item,
      });

      await this.dynamoClient.send(putCommand);
      this.logger.log(`Item successfully added to ${table}`);
    } catch (error) {
      this.logger.error(
        `Error putting item to ${table}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async deleteItem(
    table: keyof typeof TableName,
    key: Record<string, any>,
  ): Promise<void> {
    try {
      const deleteCommand = new DeleteItemCommand({
        TableName: TableName[table],
        Key: key,
      });

      await this.dynamoClient.send(deleteCommand);
      this.logger.log(`Item successfully deleted from ${table}`);
    } catch (error) {
      this.logger.error(
        `Error deleting item from ${table}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async updateItem(
    table: keyof typeof TableName,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>,
  ): Promise<void> {
    try {
      const updateCommand = new UpdateItemCommand({
        TableName: TableName[table],
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ...(expressionAttributeNames && {
          ExpressionAttributeNames: expressionAttributeNames,
        }),
      });

      await this.dynamoClient.send(updateCommand);
      this.logger.log(`Item successfully updated in ${table}`);
    } catch (error) {
      this.logger.error(
        `Error updating item in ${table}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // async createBatchCall(): Promise<void> {
  //   try {
  //   } catch (error) {
  //     this.logger.error(`Error creating batch call: ${error}`);
  //     throw new BadRequestException(
  //       `Failed to create batch call: ${error.message}`,
  //     );
  //   }
  // }
}
