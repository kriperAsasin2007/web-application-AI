import { HttpException } from '@nestjs/common';

export class ClientClosedRequestException extends HttpException {
  constructor(message = 'Client Closed Request') {
    super(
      {
        statusCode: 499,
        message,
        error: 'Client Closed Request',
      },
      499,
    );
  }
}
