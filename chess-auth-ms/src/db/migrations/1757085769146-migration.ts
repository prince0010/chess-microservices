import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1757085769146 implements MigrationInterface {
  name = 'Migration1757085769146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD \`totalScore\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`totalScore\``);
  }
}
