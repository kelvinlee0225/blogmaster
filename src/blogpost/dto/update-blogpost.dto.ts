import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BlogPostDto } from './blogpost.dto';

export class UpdateBlogpostDto extends PartialType(BlogPostDto) {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
