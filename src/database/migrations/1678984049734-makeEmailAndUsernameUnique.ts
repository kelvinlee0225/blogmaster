import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class makeEmailAndUsernameUnique1678984049734
  implements MigrationInterface
{
  name = 'makeEmailAndUsernameUnique1678984049734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
      }),
    );

    await queryRunner.changeColumn(
      'user',
      'username',
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'username',
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isNullable: false,
        isUnique: false,
      }),
    );

    await queryRunner.changeColumn(
      'user',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: false,
      }),
    );
  }
}
