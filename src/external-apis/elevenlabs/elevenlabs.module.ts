import { Module } from '@nestjs/common';
import { ElevenlabsService } from './elevenlabs.service';

@Module({
  providers: [ElevenlabsService],
  exports: [ElevenlabsService],
})
export class ElevenlabsModule {}
