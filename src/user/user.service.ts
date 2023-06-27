import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hashSync(createUserDto.password, 10),
    }

    if ( await this.prisma.user.findUnique({ where: { email: data.email } }) )
      throw new Error('Email already exists')

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map(user => ({
      ...user,
      password: undefined,
    }));
  }

  findOne(email: string) {
    const data = this.prisma.user.findUnique({ where: { email } });

    return {
      ...data,
      password: undefined,
    };
  }

  update(email: string, updateUserDto: UpdateUserDto) {
    const data = this.prisma.user.update({
      where: { email },
      data: updateUserDto,
    });

    return {
      ...data,
      password: undefined,
    };
  }

  remove(email: string) {
    const data = this.prisma.user.delete({ where: { email } })

    return {
      ...data,
      password: undefined,
    };
  }
}
