import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';
import { GetCurrentUserId, PublicApi } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicApi()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() signupDto: SignupDto,
    @Res() response: Response,
  ): Promise<void> {
    return this.authService.signupLocal(signupDto, response);
  }

  @PublicApi()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() signinDto: SigninDto,
    @Res() response: Response,
  ): Promise<void> {
    return this.authService.signinLocal(signinDto, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string, @Res() response: Response) {
    return this.authService.logout(userId, response);
  }

  @PublicApi()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() request: Request) {
    return this.authService.refreshTokens(request);
  }
}
