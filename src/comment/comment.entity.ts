import { BaseEntity } from '../baseEntity/baseEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Blogpost } from '../blogpost/blogpost.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  body: string;

  @Column()
  parentId: string;
  @ManyToOne(() => Comment, (comment) => comment.childComments)
  parentComment: Comment;

  @Column()
  childId: string;
  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Comment[];

  @Column()
  userId: string;
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column()
  blogPostId: string;
  @ManyToOne(() => Blogpost, (blogPost) => blogPost.comments)
  blogPost: Blogpost;

  constructor(body: string, userId: string, blogPostId: string) {
    super();
    this.body = body;
    this.userId = userId;
    this.blogPostId = blogPostId;
  }
}
