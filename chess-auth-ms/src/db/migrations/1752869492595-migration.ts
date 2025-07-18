import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752869492595 implements MigrationInterface {
  name = 'Migration1752869492595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD \`educationPoints\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD \`puzzlePoints\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD \`endgamesPoints\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD \`animalPoints\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth\` DROP COLUMN \`animalPoints\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` DROP COLUMN \`endgamesPoints\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` DROP COLUMN \`puzzlePoints\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` DROP COLUMN \`educationPoints\``,
    );
  }
}
