import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1754263754311 implements MigrationInterface {
  name = 'Migration1754263754311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`pgnFilename\` varchar(128) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`lessonFactor\` float NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`isGame\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`isPreview\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`isBot\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`messageModal\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` MODIFY COLUMN \`level\` varchar(64) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` MODIFY COLUMN \`level\` varchar(16) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`messageModal\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`isBot\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`isPreview\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`isGame\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`lessonFactor\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`pgnFilename\``,
    );
  }
}
