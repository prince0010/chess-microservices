import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753662033472 implements MigrationInterface {
  name = 'Migration1753662033472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent_test_record\` ADD \`failedLessonId\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent_test_record\` DROP COLUMN \`failedLessonId\``,
    );
  }
}
