import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761078222434 implements MigrationInterface {
  name = 'Migration1761078222434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` ADD \`pgnRaw\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` DROP COLUMN \`pgnRaw\``,
    );
  }
}
