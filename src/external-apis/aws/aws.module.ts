import { Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module';
import { DynamoDbModule } from './dynamo-db/dynamo-db.module';

@Module({
  imports: [S3Module, DynamoDbModule],
  exports: [S3Module, DynamoDbModule],
})
export class AwsModule {}
