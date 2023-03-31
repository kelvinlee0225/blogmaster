import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = (exception as any).response
      ? (exception as any).response.message // `response.message` is a value provided by the `class-validator`
      : (exception as any).message;
    let detail = (exception as any).detail;
    let code = 'HttpException';

    Logger.error(
      detail ? detail : message, //since `exception.stack` already shows the error message, so `detail` will replace the first line if it exists
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        detail = (exception as any).detail;
        code = (exception as any).code;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        detail = (exception as any).detail;
        code = (exception as any).code;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        detail = (exception as any).detail;
        code = (exception as any).code;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        detail = '';
        break;
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, detail, code, request));
  }
}

export const GlobalResponseError = (
  statusCode: number,
  message: string,
  detail: string,
  code: string,
  request: Request,
) => {
  return {
    statusCode,
    message,
    detail,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
