import { CreateUserDto, UserDto } from '../dto';
import { UserType } from '../enums/user-type-enum';

export const USER_ONE_ID = '41a88ef8-22be-46b9-bcc3-09456c2a2b89';
export const USER_TWO_ID = '11102106-3a71-4cfa-9348-e66d542749be';

type constantUserType = UserDto & Pick<CreateUserDto, 'password'>;

export const userOne: constantUserType = {
  id: USER_ONE_ID,
  email: 'user1@example.com',
  password: 'user1password',
  username: 'user1',
  userType: UserType.BLOGGER,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const userTwo: constantUserType = {
  id: USER_TWO_ID,
  email: 'user1@example.com',
  password: 'user1password',
  username: 'user1',
  userType: UserType.BLOGGER,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
