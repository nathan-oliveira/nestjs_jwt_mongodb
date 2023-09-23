import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../models/jwt-payload.model';
import { UserDAO } from 'src/users/models/users.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrkey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<UserDAO> {
    const user = await this.authService.validateUser(jwtPayload);
    return user;
  }
}
