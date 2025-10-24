import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761260361829 implements MigrationInterface {
  name = 'Migration1761260361829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` ADD \`folder\` varchar(32) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` ADD \`name\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` DROP COLUMN \`folder\``,
    );
  }
}
