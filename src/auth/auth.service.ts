import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      console.log('Bateu aqui 1')
      if (isPasswordValid) {
        console.log('Bateu aqui 2')
        return {
          ...user,
          password: undefined
        }
      }
    }

    throw new Error('Email address or password is incorret.')
  }
}
