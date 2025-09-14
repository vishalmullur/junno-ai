import { Module } from '@nestjs/common';
import { BatchController } from './batch/batch.controller';
import { BatchService } from './batch/batch.service';
import { IndividualController } from './individual/individual.controller';
import { IndividualService } from './individual/individual.service';
import { ContactsTransformer } from './batch/transformer/contacts.transformer';
import { ElevenlabsModule } from 'src/external-apis/elevenlabs/elevenlabs.module';
import { AwsModule } from 'src/external-apis/aws/aws.module';

@Module({
  imports: [ElevenlabsModule, AwsModule],
  controllers: [BatchController, IndividualController],
  providers: [BatchService, IndividualService, ContactsTransformer],
  exports: [BatchService],
})
export class CallsModule {}
