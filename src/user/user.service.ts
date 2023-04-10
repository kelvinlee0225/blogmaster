import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = new User(userDto.email, userDto.username, hashedPassword);
    newUser.userType = userDto.userType;
    const createdUser = await this.userRepository.save(newUser);
    return UserMapper.mapToDto(createdUser);
  }

  async findOneById(id: string) {
    const foundUser = await this.userRepository.findOneByOrFail({ id });
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

    const foundUser = await this.userRepository.findOneOrFail({
      where: whereParams,
    });
    return UserMapper.mapToDto(foundUser);
  }

  async update(updateUserDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOneOrFail({
      where: { id: updateUserDto.id },
    });

    if (foundUser) {
      if (updateUserDto.email) foundUser.email = updateUserDto.email;
      if (updateUserDto.username) foundUser.username = updateUserDto.username;
      if (updateUserDto.password) foundUser.password = updateUserDto.password;
      const updatedUser = await this.userRepository.save(foundUser);
      return UserMapper.mapToDto(updatedUser);
    }
  }

  async delete(id: string) {
    const foundUser = await this.userRepository.find({
      where: { id },
      relations: ['blogPosts'],
    });
    const deletedUser = await this.userRepository.softRemove(foundUser);
    return deletedUser.length > 0 ? true : false;
  }
}
