import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { DynamoDbModule } from 'src/external-apis/aws/dynamo-db/dynamo-db.module';

@Module({
  providers: [ApiKeyService],
  controllers: [ApiKeyController],
  imports: [DynamoDbModule]
})
export class ApiKeyModule { }
