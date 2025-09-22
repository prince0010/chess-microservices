import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1758559421627 implements MigrationInterface {
  name = 'Migration1758559421627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`lastFeedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`lastSleepAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`lastBathAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`lastCorrectPuzzleAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` CHANGE \`feedValue\` \`feedValue\` int NOT NULL DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` CHANGE \`sleepValue\` \`sleepValue\` int NOT NULL DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` CHANGE \`bathValue\` \`bathValue\` int NOT NULL DEFAULT '30'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` CHANGE \`bathValue\` \`bathValue\` int NOT NULL DEFAULT 100`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` CHANGE \`sleepValue\` \`sleepValue\` int NOT NULL DEFAULT 100`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` CHANGE \`feedValue\` \`feedValue\` int NOT NULL DEFAULT 100`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP COLUMN \`lastCorrectPuzzleAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`lastBathAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`lastSleepAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD \`lastFeedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
  }
}
