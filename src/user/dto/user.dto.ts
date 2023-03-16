import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enums/user-type-enum';

export class UserDto {
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'The username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'The password is required' })
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}
