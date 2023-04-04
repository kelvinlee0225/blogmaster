import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from '../enums/user-type-enum';

export const USER_ONE_ID = '41a88ef8-22be-46b9-bcc3-09456c2a2b89';

export const userOne: UpdateUserDto = {
  id: USER_ONE_ID,
  email: 'user1@example.com',
  password: 'user1password',
  username: 'user1',
  userType: UserType.BLOGGER,
};
