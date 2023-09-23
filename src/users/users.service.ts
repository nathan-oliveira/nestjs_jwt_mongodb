import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserDAO } from './models/users.model';
import { AuthService } from 'src/auth/auth.service';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<UserDAO>,
    private readonly authService: AuthService,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserDAO> {
    const user = new this.usersModel(signupDto);
    return user.save();
  }

  async signin({
    email,
    password,
  }: SigninDto): Promise<{ name: string; jwtToken: string; email: string }> {
    const user = await this.findByEmail(email);
    const match = await this.checkPassword(password, user);
    if (!match) throw new NotFoundException('Invalid credentials.');
    const jwtToken = await this.authService.createAccessToken(user._id);
    return {
      email: user.email,
      name: user.name,
      jwtToken,
    };
  }

  async findAll(): Promise<UserDAO[]> {
    return this.usersModel.find();
  }

  private async findByEmail(email: string): Promise<UserDAO> {
    const user = await this.usersModel.findOne({ email });
    if (!user) throw new NotFoundException('E-mail not found.');
    return user;
  }

  private async checkPassword(
    password: string,
    user: UserDAO,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new NotFoundException('Password not found.');
    return match;
  }
}
