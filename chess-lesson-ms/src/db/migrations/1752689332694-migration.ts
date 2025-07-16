import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752689332694 implements MigrationInterface {
  name = 'Migration1752689332694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot\` CHANGE \`gender\` \`animal\` varchar(16) NOT NULL DEFAULT 'male'`,
    );
    await queryRunner.query(`ALTER TABLE \`bot\` DROP COLUMN \`animal\``);
    await queryRunner.query(
      `ALTER TABLE \`bot\` ADD \`animal\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot\` CHANGE \`pointsWhenWin\` \`pointsWhenWin\` int NOT NULL DEFAULT '5'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot\` CHANGE \`pointsWhenTied\` \`pointsWhenTied\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot\` CHANGE \`pointsWhenTied\` \`pointsWhenTied\` int NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot\` CHANGE \`pointsWhenWin\` \`pointsWhenWin\` int NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE \`bot\` DROP COLUMN \`animal\``);
    await queryRunner.query(
      `ALTER TABLE \`bot\` ADD \`animal\` varchar(16) NOT NULL DEFAULT 'male'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot\` CHANGE \`animal\` \`gender\` varchar(16) NOT NULL DEFAULT 'male'`,
    );
  }
}
