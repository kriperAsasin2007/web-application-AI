import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    console.log('in decorator');
    if (!authHeader) return null; // No Authorization header found

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) return null;

    try {
      // Decode the token without verifying to extract the payload
      const decoded = jwt.decode(token) as JwtPayload;
      console.log({ decoded });

      return decoded?.sub || null; // Return the user ID (sub) or null if it doesn't exist
    } catch (error) {
      console.log('Error decoding token:', error);
      return null;
    }
  },
);
