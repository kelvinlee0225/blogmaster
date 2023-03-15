import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createComment1678482378203 implements MigrationInterface {
  name = 'createComment1678482378203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comment',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'body',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'blogPostId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'parentId',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'comment',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    );

    await queryRunner.createForeignKey(
      'comment',
      new TableForeignKey({
        columnNames: ['blogPostId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blogpost',
      }),
    );

    await queryRunner.createForeignKey(
      'comment',
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'comment',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('comment');
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    const blogPostForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('blogPostId') !== -1,
    );
    const commentForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('childId') !== -1,
    );
    await queryRunner.dropForeignKey(table, userForeignKey);
    await queryRunner.dropForeignKey(table, blogPostForeignKey);
    await queryRunner.dropForeignKey(table, commentForeignKey);
    await queryRunner.dropTable(table);
  }
}
