import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747333393385 implements MigrationInterface {
  name = 'Migration1747333393385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`isTest\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`isTest\``,
    );
  }
}
