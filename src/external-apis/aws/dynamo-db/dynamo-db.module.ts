import { Module } from '@nestjs/common';
import { DynamoDbService } from './dynamo-db.service';

@Module({
  providers: [DynamoDbService],
  exports: [DynamoDbService],
})
export class DynamoDbModule { }
