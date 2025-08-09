import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1754757902572 implements MigrationInterface {
  name = 'Migration1754757902572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`canBeSkipped\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`canBeSkipped\``,
    );
  }
}
