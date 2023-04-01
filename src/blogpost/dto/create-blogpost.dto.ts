import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
