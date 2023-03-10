import { BaseEntity } from '../baseEntity/baseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Blogpost } from '../blogpost/blogpost.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  description: string;

  @Column()
  parentId: string;
  @Column()
  parent: Comment;

  @Column()
  userId: string;
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column()
  blogId: string;
  @ManyToOne(() => Blogpost, (blogPost) => blogPost.comments)
  blogPost: Blogpost;

  constructor(description: string, userId: string, blogId: string) {
    super();
    this.description = description;
    this.userId = userId;
    this.blogId = blogId;
  }
}
