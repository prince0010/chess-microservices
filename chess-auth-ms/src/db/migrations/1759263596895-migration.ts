import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759263596895 implements MigrationInterface {
  name = 'Migration1759263596895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`hasStudentsUsingApp\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`wantToBePresentedAsACoach\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`wasWelcomeEmailSent\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` ADD \`wasDecisionEmailSent\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher\` CHANGE \`country\` \`country\` varchar(128) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher\` CHANGE \`country\` \`country\` varchar(128) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`wasDecisionEmailSent\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`wasWelcomeEmailSent\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`wantToBePresentedAsACoach\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_request\` DROP COLUMN \`hasStudentsUsingApp\``,
    );
  }
}
