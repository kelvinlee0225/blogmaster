import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsUUID()
  @IsOptional()
  parentId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'user id is required' })
  userId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'blog post id is required' })
  blogPostId: string;
}
