import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface SafeErrorBody {
  statusCode: number;
  error: string;
}

@Catch()
export class SafeExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: SafeErrorBody = {
      statusCode,
      error: this.getSafeError(statusCode)
    };

    httpAdapter.reply(ctx.getResponse(), body, statusCode);
  }

  private getSafeError(statusCode: number): string {
    if (statusCode >= 500) {
      return 'Internal server error';
    }

    return 'Request failed';
  }
}
