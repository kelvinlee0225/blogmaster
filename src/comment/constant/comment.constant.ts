import { blogPostOne } from '../../blogpost/constant';
import { USER_ONE_ID, userOne } from '../../user/constant';
import { CommentDto } from '../dto';

export const COMMENT_ONE_ID = '019ecda4-3833-42c9-86d4-c4139c496c81';
export const COMMENT_TWO_ID = '4894fa10-aeaa-4cd3-9c37-7f0ad2e3e70b';

export const commentOne: CommentDto = {
  id: COMMENT_ONE_ID,
  body: 'comment 1',
  user: {
    id: USER_ONE_ID,
    username: userOne.username,
    email: userOne.email,
    userType: userOne.userType,
  },
  userId: USER_ONE_ID,
  blogPostId: blogPostOne.id,
};

export const commentTwo: CommentDto = {
  id: COMMENT_TWO_ID,
  body: 'comment 2',
  user: {
    id: USER_ONE_ID,
    username: userOne.username,
    email: userOne.email,
    userType: userOne.userType,
  },
  userId: USER_ONE_ID,
  parentId: COMMENT_TWO_ID,
  blogPostId: blogPostOne.id,
};
