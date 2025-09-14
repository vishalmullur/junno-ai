import { Module } from '@nestjs/common';
import { WidgetKeyService } from './widget-key.service';
import { WidgetKeyController } from './widget-key.controller';

@Module({
  providers: [WidgetKeyService],
  controllers: [WidgetKeyController],
})
export class WidgetKeyModule {}
