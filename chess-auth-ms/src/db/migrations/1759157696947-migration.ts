import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759157696947 implements MigrationInterface {
  name = 'Migration1759157696947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth_teacher_request\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`status\` varchar(16) NOT NULL DEFAULT 'pending',
      \`name\` varchar(64) NOT NULL,
      \`lastName\` varchar(128) NOT NULL,
      \`email\` varchar(128) NOT NULL,
      \`mobile\` varchar(32) NOT NULL,
      \`country\` varchar(32) NOT NULL,
      \`yearsExperience\` int NOT NULL,
      \`age\` int NOT NULL,
      \`gender\` varchar(16) NOT NULL,
      \`details\` text NULL,
      \`listExperience\` text NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher\` ADD \`mobile\` varchar(16) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher\` DROP COLUMN \`mobile\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_teacher_request\``);
  }
}
