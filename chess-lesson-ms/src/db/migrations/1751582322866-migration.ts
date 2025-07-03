import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751582322866 implements MigrationInterface {
  name = 'Migration1751582322866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed\` ADD \`completedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` DROP COLUMN \`datePlayed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` ADD \`datePlayed\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` DROP COLUMN \`datePlayed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` ADD \`datePlayed\` timestamp(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed\` DROP COLUMN \`completedAt\``,
    );
  }
}
