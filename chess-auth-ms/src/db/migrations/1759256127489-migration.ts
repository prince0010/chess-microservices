import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759256127489 implements MigrationInterface {
  name = 'Migration1759256127489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`country\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`yearsExperience\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`age\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`gender\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`details\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`listExperience\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher\` ADD \`fideId\` varchar(32) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`fideId\` varchar(32) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`languages\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`languages\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`fideId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher\` DROP COLUMN \`fideId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`listExperience\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`details\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`gender\` varchar(16) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`age\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`yearsExperience\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`country\` varchar(32) NOT NULL`,
    );
  }
}
