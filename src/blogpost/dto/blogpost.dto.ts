import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
