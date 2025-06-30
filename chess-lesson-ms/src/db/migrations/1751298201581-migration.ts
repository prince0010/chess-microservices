import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751298201581 implements MigrationInterface {
  name = 'Migration1751298201581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot\` ADD \`gender\` varchar(16) NOT NULL DEFAULT 'male'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`bot\` DROP COLUMN \`gender\``);
  }
}
