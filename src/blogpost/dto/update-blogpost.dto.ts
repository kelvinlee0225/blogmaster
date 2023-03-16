import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BlogPostDto } from './blogpost.dto';

export class UpdateBlogpostDto extends PartialType(BlogPostDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
