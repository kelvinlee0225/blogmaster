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

  async login(username: string, password: string) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          username: username,
          password: password,
        },
      });

      if (foundUser) return foundUser;
      return;
    } catch (err) {
      console.error(err);
    }
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id } });
    return foundUser;
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: updateUserDto.id },
      });

      if (foundUser) {
        if (updateUserDto.username) foundUser.username = updateUserDto.username;
        if (updateUserDto.password) foundUser.password = updateUserDto.password;
        if (updateUserDto.userType) foundUser.userType = updateUserDto.userType;
        const updatedUser = await this.userRepository.save(foundUser);
        return updatedUser;
      }
    } catch (err) {
      console.error(err);
    }
  }
}