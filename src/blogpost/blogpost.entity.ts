import { BaseEntity } from '../common/base/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Blogpost extends BaseEntity {
  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.blogPosts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.blogPost)
  comments: Comment[];

  constructor(title: string, body: string, userId: string) {
    super();
    this.title = title;
    this.body = body;
    this.userId = userId;
  }
}
