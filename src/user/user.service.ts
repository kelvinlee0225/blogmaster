import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto) {
    try {
      const user = await this.findOne({
        email: userDto.email,
        username: userDto.username,
      });
      if (!!user)
        throw new UnprocessableEntityException(
          `The email or username is already taken`,
        );

      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const newUser = new User(userDto.email, userDto.username, hashedPassword);
      newUser.userType = userDto.userType;
      const createdUser = await this.userRepository.save(newUser);
      return createdUser;
    } catch (err) {
      console.error(err);
      return err.message;
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

  async delete(id: string) {
    try {
      const foundUser = await this.userRepository.find({
        where: { id },
        relations: ['blogPosts'],
      });
      const deletedUser = await this.userRepository.softRemove(foundUser);
      return deletedUser.length > 0 ? true : false;
    } catch (err) {
      console.error(err);
    }
  }
}
