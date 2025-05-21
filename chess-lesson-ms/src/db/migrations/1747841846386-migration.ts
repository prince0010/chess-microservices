import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747841846386 implements MigrationInterface {
  name = 'Migration1747841846386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_played\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`lastLessonPlayed\` int NOT NULL,
      \`lessonParentId\` int NOT NULL,
      UNIQUE INDEX \`IDX_29f6193732925395b59d431091\` (\`lessonParentId\`, \`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_played\` ADD CONSTRAINT \`FK_9522955a13602da85197a2a57f7\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_played\` DROP FOREIGN KEY \`FK_9522955a13602da85197a2a57f7\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_29f6193732925395b59d431091\` ON \`lesson_played\``,
    );
    await queryRunner.query(`DROP TABLE \`lesson_played\``);
  }
}
