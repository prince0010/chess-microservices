import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1744129593757 implements MigrationInterface {
  name = 'Migration1744129593757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`feedValue\` int NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`sleepValue\` int NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`bathValue\` int NOT NULL DEFAULT '100'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`bathValue\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`sleepValue\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`feedValue\``,
    );
  }
}
