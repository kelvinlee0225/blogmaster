import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { UpdateCommentDto } from './update-comment.dto';
import { CreateCommentDto } from './create-comment.dto';

export class FindCommentDto extends IntersectionType(
  PartialType(
    PickType(CreateCommentDto, ['blogPostId', 'userId', 'parentId'] as const),
  ),
  PartialType(PickType(UpdateCommentDto, ['id'] as const)),
) {
  @ApiProperty({ type: Number, required: false })
  @IsNumberString()
  @IsOptional()
  limit?: number | string;

  @ApiProperty({ type: Number, required: false })
  @IsNumberString()
  @IsOptional()
  page?: number | string;
}
