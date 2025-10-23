import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761239426717 implements MigrationInterface {
  name = 'Migration1761239426717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // STEP 1: Disable foreign key checks (to avoid constraint errors)
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);

    // STEP 2: Truncate table to remove existing data
    await queryRunner.query(`TRUNCATE TABLE \`lesson_advanced\`;`);

    // STEP 3: Re-enable foreign key checks
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);

    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` ADD \`metadata\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` ADD \`movesTree\` json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` DROP COLUMN \`movesTree\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_advanced\` DROP COLUMN \`metadata\``,
    );
  }
}
