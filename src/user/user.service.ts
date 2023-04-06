import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = new User(userDto.email, userDto.username, hashedPassword);
    newUser.userType = userDto.userType;
    const createdUser = await this.userRepository.save(newUser);
    return createdUser;
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
    return foundUser;
  }

  async update(updateUserDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOneOrFail({
      where: { id: updateUserDto.id },
    });

    if (foundUser) {
      if (updateUserDto.username) foundUser.username = updateUserDto.username;
      if (updateUserDto.password) foundUser.password = updateUserDto.password;
      if (updateUserDto.userType) foundUser.userType = updateUserDto.userType;
      const updatedUser = await this.userRepository.save(foundUser);
      return updatedUser;
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
