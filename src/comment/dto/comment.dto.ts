import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { User } from '../../user/user.entity';
import { UpdateCommentDto } from './update-comment.dto';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../comment.entity';
import { BaseDto } from '../../common/base';

class extendedDto extends PickType(UpdateCommentDto, ['id'] as const) {}

export class CommentDto extends IntersectionType(
  PartialType(CreateCommentDto),
  extendedDto,
  BaseDto,
) {
  user?: Pick<User, 'id' | 'username' | 'email' | 'userType'>;
  parent?: Pick<Comment, 'id' | 'body'>;
}
