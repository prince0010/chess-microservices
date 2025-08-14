import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1755125618530 implements MigrationInterface {
  name = 'Migration1755125618530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth_story_unlocked\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`story\` varchar(32) NOT NULL,
      \`modeWasUnlocked\` varchar(32) NOT NULL DEFAULT 'COMPLETING_LESSONS',
      \`userUid\` int NOT NULL,
      UNIQUE INDEX \`IDX_859791460a9ce8e932b84aaaa6\` (\`story\`, \`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_story_unlocked\` ADD CONSTRAINT \`FK_379819d2e3aa97f864cfc6d796f\`FOREIGN KEY (\`userUid\`) REFERENCES \`auth\`(\`uid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_story_unlocked\` DROP FOREIGN KEY \`FK_379819d2e3aa97f864cfc6d796f\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_859791460a9ce8e932b84aaaa6\` ON \`auth_story_unlocked\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_story_unlocked\``);
  }
}
