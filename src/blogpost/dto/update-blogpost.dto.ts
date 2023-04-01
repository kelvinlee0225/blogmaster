import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateBlogPostDto } from './create-blogpost.dto';

export class UpdateBlogpostDto extends PartialType(CreateBlogPostDto) {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
