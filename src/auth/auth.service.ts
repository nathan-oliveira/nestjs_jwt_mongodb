import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Request } from 'express';

import { UserDAO } from 'src/users/models/users.model';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<UserDAO>,
  ) {}

  async createAccessToken(userId: string): Promise<string> {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  async validateUser({ userId }: JwtPayload): Promise<UserDAO> {
    const user = await this.usersModel.findOne({ _id: userId });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  private jwtExtractor(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new BadRequestException('Bad request');
    const [, token] = authHeader.split(' ');
    return token;
  }

  returnJwtExtractor(): (req: Request) => string {
    return this.jwtExtractor;
  }
}
