import { BaseEntity } from '../baseEntity/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

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

  constructor(title: string, body: string, userId: string) {
    super();
    this.title = title;
    this.body = body;
    this.userId = userId;
  }
}
