import { Blogpost } from 'src/blogpost/blogpost.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity/baseEntity';
import { UserType } from './enums/user-type-enum';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
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

  constructor(email: string, username: string, password: string) {
    super();
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
