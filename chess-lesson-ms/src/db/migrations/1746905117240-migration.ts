import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746905117240 implements MigrationInterface {
  name = 'Migration1746905117240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson\` DROP FOREIGN KEY \`FK_a94f16fbd7c0bd44656e31d5ee2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD CONSTRAINT \`FK_3062dd57a099c985f44f7f5957a\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson\` DROP FOREIGN KEY \`FK_3062dd57a099c985f44f7f5957a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD CONSTRAINT \`FK_a94f16fbd7c0bd44656e31d5ee2\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
