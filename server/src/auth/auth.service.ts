import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
        hashedRt: hash,
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

  async signupLocal(signupDto: SignupDto): Promise<Tokens> {
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
    return tokens;
  }

  async signinLocal(signinDto: SigninDto): Promise<Tokens> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access denied!');
    const passwordsMatches = await bcrypt.compare(
      signinDto.password,
      user.password,
    );
    if (!passwordsMatches) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.databaseService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log({ user });
    console.log({ rt });

    if (!user || !user.hashedRt) throw new ForbiddenException('Access denied!');
    const rtMathches = await bcrypt.compare(rt, user.hashedRt);
    console.log({ testCrypt: await bcrypt.hash(rt, 10) });
    if (!rtMathches) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
