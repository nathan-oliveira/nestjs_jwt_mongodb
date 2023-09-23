import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { UserDAO } from './models/users.model';
import { SigninDto } from './dto/signin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<UserDAO> {
    return this.usersService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async signin(
    @Body() signinDto: SigninDto,
  ): Promise<{ name: string; jwtToken: string; email: string }> {
    return this.usersService.signin(signinDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserDAO[]> {
    return this.usersService.findAll();
  }
}
