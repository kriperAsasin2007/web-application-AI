import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}
  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    this.logger.log(
      `Creating a new user with email: ${createUserDto.email}`,
      UsersController.name,
    );

    const newUser = await this.usersService.create(createUserDto);

    this.logger.log(
      `User created successfully with ID: ${newUser.id}`,
      UsersController.name,
    );
    return newUser;
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Getting user by id: ${id}`, UsersController.name);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`, UsersController.name);

    const updatedUser = await this.usersService.update(id, updateUserDto);

    this.logger.log(
      `User updated successfully with ID: ${updatedUser.id}`,
      UsersController.name,
    );

    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting user with ID: ${id}}`, UsersController.name);

    const removedUser = this.usersService.remove(id);

    this.logger.log(
      `Deleted user with id: ${(await removedUser).id}`,
      UsersController.name,
    );

    return removedUser;
  }
}
