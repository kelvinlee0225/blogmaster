import { UserType } from '../../../user/enums/user-type-enum';

export const adminSeed = {
  id: '69bbf44b-4104-4fbc-b86a-822f980afc4d',
  email: 'admin1@gmail.com',
  username: 'admin1',
  userType: UserType.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
