import { Test, TestingModule } from '@nestjs/testing';
import { BlogpostService } from './blogpost.service';

describe('BlogpostService', () => {
  let service: BlogpostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogpostService],
    }).compile();

    service = module.get<BlogpostService>(BlogpostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
