import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../user/user.entity';
import { adminSeed } from './constant';
import * as bcrypt from 'bcrypt';

export default class CreateAdmin implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          ...adminSeed,
          password: await bcrypt.hash('password1', 10),
        },
      ])
      .execute();
  }
}
