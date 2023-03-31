import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCommentDto extends PartialType(CommentDto) {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
