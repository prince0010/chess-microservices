import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753725270091 implements MigrationInterface {
  name = 'Migration1753725270091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD \`timer\` int NOT NULL DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` ADD \`timer\` int NOT NULL DEFAULT '30'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent\` DROP COLUMN \`timer\``,
    );
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`timer\``);
  }
}
