import { BaseEntity } from '../baseEntity/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Blogpost extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.blogPosts)
  @JoinColumn({ name: 'userId' })
  user: User;

  constructor(title: string, description: string, userId: string) {
    super();
    this.title = title;
    this.description = description;
    this.userId = userId;
  }
}
