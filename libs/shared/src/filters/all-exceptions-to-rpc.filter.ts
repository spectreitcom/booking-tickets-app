import { Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { RpcErrorResponse } from './rpc-error-response';

@Catch()
export class AllExceptionsToRpcFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(AllExceptionsToRpcFilter.name);

  catch(exception: unknown): Observable<never> {
    const error = this.normalize(exception);
    this.logger.error(
      error.message,
      exception instanceof Error ? exception.stack : undefined,
    );
    return throwError(() => new RpcException(error));
  }

  private normalize(exception: unknown): RpcErrorResponse {
    if (exception instanceof RpcException) {
      const error = exception.getError();
      return typeof error === 'string'
        ? { statusCode: 500, message: error }
        : (error as RpcErrorResponse);
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as { message?: string }).message ?? exception.message);
      return {
        statusCode: exception.getStatus(),
        message,
        error: exception.name,
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: 500,
        message: exception.message,
        error: exception.name,
      };
    }

    return { statusCode: 500, message: 'Internal server error' };
  }
}
