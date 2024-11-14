import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    console.log('in decorator');
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
      const decoded = jwt.decode(token) as JwtPayload;
      console.log({ decoded });

      return decoded?.sub || null;
    } catch (error) {
      console.log('Error decoding token:', error);
      return null;
    }
  },
);
