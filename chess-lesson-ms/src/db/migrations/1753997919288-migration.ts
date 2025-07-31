import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753997919288 implements MigrationInterface {
  name = 'Migration1753997919288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`pointsPerLesson\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`quantityToUnlockNext\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`levelFrontend\` varchar(32) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`levelFrontend\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`quantityToUnlockNext\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`pointsPerLesson\``,
    );
  }
}
