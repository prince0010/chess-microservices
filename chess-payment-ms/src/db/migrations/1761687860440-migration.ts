import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761687860440 implements MigrationInterface {
  name = 'Migration1761687860440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`stripeChargeId\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`stripeChargeId\``,
    );
  }
}
