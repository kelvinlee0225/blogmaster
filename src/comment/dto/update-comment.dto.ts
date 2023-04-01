import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
