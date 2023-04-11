import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateBlogPostDto } from './create-blogpost.dto';

export class FindBlogPostDto extends PartialType(CreateBlogPostDto) {
  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  page?: number;
}
