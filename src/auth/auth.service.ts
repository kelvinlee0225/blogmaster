import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ username });
    if (!user) new NotAcceptableException('Could not find the user');
    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }
    throw new NotAcceptableException('The username and password do not match');
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      userType: user.userType,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
