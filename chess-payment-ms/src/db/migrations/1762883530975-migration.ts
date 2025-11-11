import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762883530975 implements MigrationInterface {
  name = 'Migration1762883530975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_subscription\` ADD \`expiresAt\` datetime NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_subscription\` DROP COLUMN \`expiresAt\``,
    );
  }
}
