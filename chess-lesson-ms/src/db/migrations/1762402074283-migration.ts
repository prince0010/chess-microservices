import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762402074283 implements MigrationInterface {
  name = 'Migration1762402074283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`nameTr\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`levelTr\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`levelTr\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`nameTr\``,
    );
  }
}
