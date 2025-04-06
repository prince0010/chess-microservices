import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743899241187 implements MigrationInterface {
  name = 'Migration1743899241187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD \`points\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`points\``);
  }
}
