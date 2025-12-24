import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766596657181 implements MigrationInterface {
  name = 'Migration1766596657181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`verificationStatus\` varchar(32) NOT NULL DEFAULT 'UNVERIFIED'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`verificationStatus\``,
    );
  }
}
