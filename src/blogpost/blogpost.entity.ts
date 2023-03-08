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
  user_id: string;

  @ManyToOne(() => User, (user) => user.blogPosts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
