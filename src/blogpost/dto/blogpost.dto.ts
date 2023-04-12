import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { User } from '../../user/user.entity';
import { CreateBlogPostDto } from './create-blogpost.dto';
import { UpdateBlogpostDto } from './update-blogpost.dto';
import { BaseDto } from '../../common/base';

class extendedCreateDto extends PickType(CreateBlogPostDto, [
  'body',
  'title',
] as const) {}
class extendedUpdateDto extends PickType(UpdateBlogpostDto, ['id'] as const) {}

export class BlogPostDto extends IntersectionType(
  extendedCreateDto,
  extendedUpdateDto,
  BaseDto,
) {
  @ApiProperty({ type: User, required: false })
  @ValidateNested()
  @IsOptional()
  user?: Pick<User, 'id' | 'username' | 'email' | 'userType'>;

  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
