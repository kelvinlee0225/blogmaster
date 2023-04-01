import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { User } from '../../user/user.entity';
import { CreateBlogPostDto } from './create-blogpost.dto';
import { UpdateBlogpostDto } from './update-blogpost.dto';

class extendedDto extends PickType(UpdateBlogpostDto, ['id'] as const) {}

export class BlogPostDto extends IntersectionType(
  CreateBlogPostDto,
  extendedDto,
) {
  @ApiProperty({ type: User, required: false })
  @ValidateNested()
  @IsOptional()
  user: Pick<User, 'id' | 'username' | 'email' | 'userType'>;
}
