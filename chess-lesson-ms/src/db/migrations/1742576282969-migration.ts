import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742576282969 implements MigrationInterface {
  name = 'Migration1742576282969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`pgn\``);
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD \`moves\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD \`pgnRaw\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`pgnRaw\``);
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`moves\``);
    await queryRunner.query(`ALTER TABLE \`lesson\` ADD \`pgn\` text NOT NULL`);
  }
}
