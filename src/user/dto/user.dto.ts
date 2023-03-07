import { UserType } from '../enums/user-type-enum';

export class UserDto {
  email: string;
  username: string;
  password: string;
  userType: UserType;
}
