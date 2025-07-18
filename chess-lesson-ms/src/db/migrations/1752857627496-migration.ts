import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752857627496 implements MigrationInterface {
  name = 'Migration1752857627496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`story\` varchar(32) NOT NULL DEFAULT 'Education'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD \`story\` varchar(32) NOT NULL DEFAULT 'Education'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`story\``);
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`story\``,
    );
  }
}
