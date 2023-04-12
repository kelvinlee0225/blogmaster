import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './mapper';
import { BlogpostService } from '../blogpost/blogpost.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private blogPostService: BlogpostService,
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
    const deletedBlogPost = await this.userRepository.softDelete(id);

    if (deletedBlogPost.affected > 0) {
      const toBeDeletedBlogPostsId = [];
      let page = 1;

      while (true) {
        const foundBlogPosts = await this.blogPostService.findBlogPostsIds({
          userId: id,
          limit: 15,
          page,
        });
        toBeDeletedBlogPostsId.push(...foundBlogPosts.ids);

        if (
          foundBlogPosts.meta.totalPages < 1 ||
          foundBlogPosts.meta.currentPage === foundBlogPosts.meta.totalPages
        )
          break;
        else page++;
      }

      if (toBeDeletedBlogPostsId.length > 0) {
        for (let i = 0; i < toBeDeletedBlogPostsId.length; i++)
          this.blogPostService.delete(toBeDeletedBlogPostsId[i]);
      }
      return true;
    }
    return false;
  }
}
