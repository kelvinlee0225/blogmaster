import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enums/user-type-enum';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}
