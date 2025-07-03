import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751571111024 implements MigrationInterface {
  name = 'Migration1751571111024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` ADD \`color\` varchar(8) NOT NULL DEFAULT 'white'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` DROP COLUMN \`color\``,
    );
  }
}
