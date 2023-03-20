import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/data-source';
import { UserModule } from './user/user.module';
import { BlogpostModule } from './blogpost/blogpost.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    BlogpostModule,
    CommentModule,
    AuthModule,
  ],
})
export class AppModule {}
