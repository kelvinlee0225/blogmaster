import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { User } from '../../user/user.entity';
import { UpdateCommentDto } from './update-comment.dto';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../comment.entity';

class extendedDto extends PickType(UpdateCommentDto, ['id'] as const) {}

export class CommentDto extends IntersectionType(
  CreateCommentDto,
  extendedDto,
) {
  @ApiProperty({ type: User, required: false })
  @ValidateNested()
  @IsOptional()
  user: Pick<User, 'id' | 'username' | 'email' | 'userType'>;

  @ApiProperty({ type: Comment, required: false })
  @ValidateNested()
  @IsOptional()
  parent: Pick<Comment, 'id' | 'body'>;
}
