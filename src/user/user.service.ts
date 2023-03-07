import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto) {
    const newUser = new User(userDto.email, userDto.username, userDto.password);
    newUser.userType = userDto.userType;
    const createdUser = await this.userRepository.save(newUser);
    return createdUser;
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id } });
    return foundUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
