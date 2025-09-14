import { Test, TestingModule } from '@nestjs/testing';
import { WidgetKeyController } from './widget-key.controller';

describe('WidgetKeyController', () => {
  let controller: WidgetKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetKeyController],
    }).compile();

    controller = module.get<WidgetKeyController>(WidgetKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
