import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../comment.service';
import { Comment } from '../comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../common/mock-data';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: { ...repositoryMock },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
