import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { UpdateCommentDto } from './update-comment.dto';

export class FindCommentDto extends PartialType(
  PickType(UpdateCommentDto, ['blogPostId', 'userId', 'parentId'] as const),
) {
  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  page?: number;
}
