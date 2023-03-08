import { Test, TestingModule } from '@nestjs/testing';
import { BlogpostController } from '../blogpost.controller';
import { BlogpostService } from '../blogpost.service';

describe('BlogpostController', () => {
  let controller: BlogpostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogpostController],
      providers: [BlogpostService],
    }).compile();

    controller = module.get<BlogpostController>(BlogpostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
