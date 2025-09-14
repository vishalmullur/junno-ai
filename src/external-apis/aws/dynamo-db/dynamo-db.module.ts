import { Module } from '@nestjs/common';
import { DynamoDbService } from './dynamo-db.service';

@Module({
  providers: [DynamoDbService],
})
export class DynamoDbModule {}
