import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1756403086777 implements MigrationInterface {
  name = 'Migration1756403086777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth_teacher\` (
      \`uid\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`username\` varchar(255) NOT NULL,
      \`password\` varchar(255) NOT NULL,
      \`country\` varchar(128) NOT NULL,
      \`roles\` text NOT NULL DEFAULT 'TEACHER',
      \`isActive\` tinyint NOT NULL DEFAULT 1,
      \`gender\` varchar(64) NOT NULL DEFAULT 'private',
      \`birthday\` date NULL,
      \`token\` varchar(128) NULL,
      UNIQUE INDEX \`IDX_eea15afbde535080c26e68ba04\` (\`username\`),
      PRIMARY KEY (\`uid\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_eea15afbde535080c26e68ba04\` ON \`auth_teacher\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_teacher\``);
  }
}
