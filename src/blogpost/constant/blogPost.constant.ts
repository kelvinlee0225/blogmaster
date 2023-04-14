import { USER_ONE_ID, userOne } from '../../user/constant';
import { BlogPostDto } from '../dto';

export const BLOG_POST_ONE_ID = 'e8cf0658-9558-4bfc-b34c-7164756e38c1';
export const BLOG_POST_TWO_ID = '4894fa10-aeaa-4cd3-9c37-7f0ad2e3e70b';

export const blogPostOne: BlogPostDto = {
  id: BLOG_POST_ONE_ID,
  title: 'title 1',
  body: 'body 1',
  user: {
    id: USER_ONE_ID,
    username: userOne.username,
    email: userOne.email,
    userType: userOne.userType,
  },
  userId: USER_ONE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const blogPostTwo: BlogPostDto = {
  id: BLOG_POST_TWO_ID,
  title: 'title 2',
  body: 'body 2',
  user: {
    id: USER_ONE_ID,
    username: userOne.username,
    email: userOne.email,
    userType: userOne.userType,
  },
  userId: USER_ONE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
