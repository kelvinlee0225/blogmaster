import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto extends IntersectionType(
  PickType(UpdateUserDto, ['id'] as const),
  OmitType(CreateUserDto, ['password'] as const),
) {
  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsNotEmpty()
  deletedAt?: Date;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  password?: string;
}
