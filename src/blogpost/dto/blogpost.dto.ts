import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { User } from '../../user/user.entity';
import { CreateBlogPostDto } from './create-blogpost.dto';
import { UpdateBlogpostDto } from './update-blogpost.dto';

class extendedDto extends PickType(UpdateBlogpostDto, ['id'] as const) {}

export class BlogPostDto extends IntersectionType(
  CreateBlogPostDto,
  extendedDto,
) {
  @ApiProperty({ type: User, required: true })
  @ValidateNested()
  @IsNotEmpty()
  user: Pick<User, 'id' | 'username' | 'email' | 'userType'>;
}
