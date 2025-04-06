import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743911033087 implements MigrationInterface {
  name = 'Migration1743911033087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot\` ADD \`pointsWhenWin\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot\` ADD \`pointsWhenTied\` int NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot\` DROP COLUMN \`pointsWhenTied\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot\` DROP COLUMN \`pointsWhenWin\``,
    );
  }
}
