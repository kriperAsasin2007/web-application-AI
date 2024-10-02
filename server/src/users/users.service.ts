import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    if (!createUserDto) throw new BadRequestException("User can't be null");
    return createUserDto;
  }
}
