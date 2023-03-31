import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CommentDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  parentId: string;

  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  blogPostId: string;
}
