import { Test, TestingModule } from '@nestjs/testing';
import { WidgetKeyService } from './widget-key.service';

describe('WidgetKeyService', () => {
  let service: WidgetKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetKeyService],
    }).compile();

    service = module.get<WidgetKeyService>(WidgetKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
