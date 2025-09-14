import { Module } from '@nestjs/common';
import { ElevenlabsModule } from './elevenlabs/elevenlabs.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [ElevenlabsModule, AwsModule],
})
export class ExternalApisModule {}
