import { HttpStatus } from '@nestjs/common';

export interface ErrorResponse {
  status: string;
  status_code: HttpStatus;
  timestamp: string;
  path: string;
  message: string | object;
  stack?: string;
  error?: string;
}
