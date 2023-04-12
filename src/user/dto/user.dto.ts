import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../common/base';

export class UserDto extends IntersectionType(
  PickType(UpdateUserDto, ['id'] as const),
  OmitType(CreateUserDto, ['password'] as const),
  BaseDto,
) {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  password?: string;
}
