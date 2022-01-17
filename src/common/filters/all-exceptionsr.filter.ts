import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

type HttpErrorResponse = {
  message: string | object;
};

@Catch()
export class AllExceptionsrFilter<T extends Error> implements ExceptionFilter {
  private readonly logger: Logger;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(AllExceptionsrFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();

    const responseBody = this.extractError(exception, host);

    if (!(exception instanceof HttpException)) {
      this.logger.error(JSON.stringify(exception));
      this.logger.error(exception.stack);
    }

    httpAdapter.reply(
      context.getResponse(),
      responseBody,
      responseBody.statusCode,
    );
  }

  private extractError(exception: T, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();

    const { httpAdapter } = this.httpAdapterHost;

    const isHttpException = exception instanceof HttpException;

    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const enviroment = this.configService.get<string>('NODE_ENV');

    const commonInfo = {
      status: 'error',
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(httpContext.getRequest()),
    };

    const message =
      isHttpException && typeof exception.getResponse() === 'object'
        ? (exception.getResponse() as HttpErrorResponse).message
        : exception.message;

    if (enviroment !== 'production') {
      return {
        ...commonInfo,
        message,
        stack: exception.stack,
        error: exception.name,
      };
    }

    return {
      ...commonInfo,
      message: exception.message,
    };
  }
}
