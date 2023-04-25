import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Blogpost } from '../../blogpost/blogpost.entity';
import { blogPostSeedConstant } from './constant';

export default class CreateBlogPost implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Blogpost)
      .values([blogPostSeedConstant])
      .execute();
  }
}
