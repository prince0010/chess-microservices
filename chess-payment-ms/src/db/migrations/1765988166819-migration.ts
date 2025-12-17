import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765988166819 implements MigrationInterface {
  name = 'Migration1765988166819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification_purchase\` ADD \`destination\` enum ('APP', 'WEBSITE') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification_purchase\` DROP COLUMN \`destination\``,
    );
  }
}
