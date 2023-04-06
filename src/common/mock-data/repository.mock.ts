import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

export const repositoryMock = createMock<Repository<any>>({
  findOneOrFail: jest.fn().mockResolvedValue({}),
  findOneByOrFail: jest.fn().mockResolvedValue({}),
  find: jest.fn().mockResolvedValue({}),
  save: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
  softDelete: jest.fn().mockResolvedValue({}),
  softRemove: jest.fn().mockResolvedValue({}),
  createQueryBuilder: jest.fn().mockResolvedValue({
    where: jest.fn().mockResolvedValue({}),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
  }),
});
