import { BaseEntity } from '../baseEntity/baseEntity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  userType: string;

  constructor(email: string, username: string, password: string) {
    super();
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
