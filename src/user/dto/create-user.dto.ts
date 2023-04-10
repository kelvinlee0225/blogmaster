import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enums/user-type-enum';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserType, required: true })
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}
