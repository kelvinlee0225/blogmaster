import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';

export const requestMock = () => {
  return createMock<Request>();
};
