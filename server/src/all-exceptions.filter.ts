import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

type ErrorResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponseObject: ErrorResponseObject = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      errorResponseObject.statusCode = exception.getStatus();
      errorResponseObject.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      errorResponseObject.statusCode = 422;
      errorResponseObject.response = exception.message.replaceAll(/\n/g, '');
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        errorResponseObject.statusCode = 409;
        errorResponseObject.response = 'Email is already taken';
      } else {
        errorResponseObject.statusCode = 422;
        errorResponseObject.response = exception.message.replaceAll(/\n/g, '');
      }
    } else {
      errorResponseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponseObject.response = 'Internal Server Error';
    }
    response.status(errorResponseObject.statusCode).json(errorResponseObject);

    super.catch(exception, host);
  }
}
