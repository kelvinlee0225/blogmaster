import { Blogpost } from '../blogpost/blogpost.entity';
import { Comment } from '../comment/comment.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base-entity';
import { UserType } from './enums/user-type-enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @OneToMany(() => Blogpost, (blogPost) => blogPost.user)
  blogPosts: Blogpost[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  constructor(email: string, username: string, password: string) {
    super();
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
