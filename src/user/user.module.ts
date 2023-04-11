import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.entity';
import { BlogpostService } from '../blogpost/blogpost.service';
import { Blogpost } from '../blogpost/blogpost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blogpost, Comment])],
  controllers: [UserController],
  providers: [UserService, BlogpostService, CommentService],
  exports: [UserService],
})
export class UserModule {}
