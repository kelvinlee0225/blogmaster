import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../comment.service';
import { Repository } from 'typeorm';
import { Comment } from '../comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../common/mock-data';

describe('CommentService', () => {
  let service: CommentService;
  let repository: Repository<Comment>;

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
    repository = await module.get(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
