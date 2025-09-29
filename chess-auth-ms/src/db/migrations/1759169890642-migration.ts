import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759169890642 implements MigrationInterface {
  name = 'Migration1759169890642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`documents\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`documents\``,
    );
  }
}
