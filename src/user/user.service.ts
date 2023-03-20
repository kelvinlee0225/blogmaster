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
    try {
      const newUser = new User(
        userDto.email,
        userDto.username,
        userDto.password,
      );
      newUser.userType = userDto.userType;
      const createdUser = await this.userRepository.save(newUser);
      return createdUser;
    } catch (err) {
      console.error(err);
    }
  }

  async findOneById(id: string) {
    const foundUser = await this.userRepository.findOneBy({ id });
    return foundUser;
  }

  async findOne({
    id,
    email,
    username,
  }: Pick<Partial<UpdateUserDto>, 'id' | 'email' | 'username'>) {
    const whereParams = {};
    if (id) whereParams['id'] = id;
    if (email) whereParams['email'] = email;
    if (username) whereParams['username'] = username;

    const foundUser = await this.userRepository.findOne({ where: whereParams });
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
