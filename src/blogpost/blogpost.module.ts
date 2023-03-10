import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogpost } from './blogpost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blogpost])],
  controllers: [BlogpostController],
  providers: [BlogpostService],
})
export class BlogpostModule {}
