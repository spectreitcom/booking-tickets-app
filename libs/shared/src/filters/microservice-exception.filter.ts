import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcErrorResponse } from './rpc-error-response';

function isRpcErrorResponse(error: unknown): error is RpcErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as RpcErrorResponse).message === 'string'
  );
}

function isValidHttpStatus(statusCode: unknown): statusCode is number {
  return (
    typeof statusCode === 'number' &&
    Number.isInteger(statusCode) &&
    statusCode >= 100 &&
    statusCode < 600
  );
}

/**
 * Catches errors that reject from `ClientProxy#send()` calls (normalized by
 * `AllExceptionsToRpcFilter` on the microservice side) and any regular
 * HTTP-side exceptions, translating both into a consistent HTTP response
 * instead of Nest's generic 500 for anything that isn't an `HttpException`.
 */
@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MicroserviceExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (isRpcErrorResponse(exception)) {
      const statusCode = isValidHttpStatus(exception.statusCode)
        ? exception.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(statusCode).json({
        statusCode,
        message: exception.message,
        error: exception.error,
      });
      return;
    }

    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
