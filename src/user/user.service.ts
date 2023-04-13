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
    return UserMapper.mapToDto(foundUser);
  }

  async findOne(
    {
      id,
      email,
      username,
    }: Pick<Partial<UpdateUserDto>, 'id' | 'email' | 'username'>,
    withPassword = false,
  ) {
    const whereParams = {};
    if (id) whereParams['id'] = id;
    if (email) whereParams['email'] = email;
    if (username) whereParams['username'] = username;

    const foundUser = await this.userRepository.findOneOrFail({
      where: whereParams,
    });
    return UserMapper.mapToDto(foundUser, withPassword);
  }

  async update(updateUserDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOneOrFail({
      where: { id: updateUserDto.id },
    });

    if (updateUserDto.email) foundUser.email = updateUserDto.email;
    if (updateUserDto.username) foundUser.username = updateUserDto.username;
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      foundUser.password = hashedPassword;
    }
    const updatedUser = await this.userRepository.save(foundUser);
    return UserMapper.mapToDto(updatedUser);
  }

  async delete(id: string) {
    const foundUser = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['blogPosts', 'blogPosts.comments'],
    });

    const deletedBlogPost = await this.userRepository.softRemove(foundUser);

    return !!deletedBlogPost.deletedAt ? true : false;
  }
}
