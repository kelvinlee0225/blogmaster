import { PartialType } from '@nestjs/swagger';
import { BlogPostDto } from './blogpost.dto';

export class UpdateBlogpostDto extends PartialType(BlogPostDto) {
  id: string;
}
