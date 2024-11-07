import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Res } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/types';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { SigninDto, SignupDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_AT_SECRET,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_RT_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signupLocal(
    signupDto: SignupDto,
    @Res() response: Response,
  ): Promise<void> {
    const hashedPassword = await this.hashData(signupDto.password);

    const newUser = await this.databaseService.user.create({
      data: {
        username: signupDto.username,
        email: signupDto.email,
        password: hashedPassword,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
    });

    response.json({ access_token: tokens.access_token });
  }

  async signinLocal(
    signinDto: SigninDto,
    @Res() response: Response,
  ): Promise<void> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });
    console.log({ user });
    if (!user) throw new ForbiddenException('No user with such email!');
    const passwordsMatches = await bcrypt.compare(
      signinDto.password,
      user.password,
    );
    console.log({ passwordsMatches });
    if (!passwordsMatches) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
    });

    response.json({ access_token: tokens.access_token });
  }

  async logout(userId: string, @Res() response: Response) {
    await this.databaseService.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    response.clearCookie('refresh_token');
    response.json({ message: 'Log out successful' });
  }

  async refreshTokens(@Req() request: Request) {
    const rt = request?.cookies?.refresh_token;
    console.log({ coockieCheck: request?.cookies });
    console.log({ rt });
    if (!rt) {
      throw new ForbiddenException('No refresh token!');
    }

    // console.log({ request });
    try {
      // Decode the token without verifying to extract the payload
      const decoded = jwt.decode(rt) as JwtPayload;
      console.log({ decoded });
      const userId = decoded?.sub || null;
      const userEmail = decoded?.email || null;
      const tokens = await this.getTokens(userId, userEmail);
      // await this.updateRtHash(user.id, tokens.refresh_token);
      return { access_token: tokens.access_token };
    } catch {
      throw new ForbiddenException('Error decoding token!');
    }
  }
}
