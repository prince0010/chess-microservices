import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1740278440535 implements MigrationInterface {
  name = 'Migration1740278440535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth\` (\`uid\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`username\` varchar(255) NOT NULL,
          \`password\` varchar(255) NOT NULL,
          \`country\` varchar(128) NOT NULL,
          \`gender\` varchar(64) NOT NULL DEFAULT 'private',
          \`birthday\` date NULL,
          \`token\` varchar(128) NULL,
          \`roles\` text NOT NULL DEFAULT 'PLAYER',
          \`isActive\` tinyint NOT NULL DEFAULT 1,
          UNIQUE INDEX \`IDX_366ebf23d8f3781bb7bb37abbd\` (\`username\`),
          PRIMARY KEY (\`uid\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_366ebf23d8f3781bb7bb37abbd\` ON \`auth\``,
    );
    await queryRunner.query(`DROP TABLE \`auth\``);
  }
}
