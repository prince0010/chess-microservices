import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750274701351 implements MigrationInterface {
  name = 'Migration1750274701351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`piece_square_level_completed\` ADD \`counter\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`piece_square_level_completed\` DROP COLUMN \`counter\``,
    );
  }
}
