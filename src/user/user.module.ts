import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DynamoDbModule } from 'src/external-apis/aws/dynamo-db/dynamo-db.module';

@Module({
  providers: [UserService],
  imports: [DynamoDbModule]
})
export class UserModule { }
