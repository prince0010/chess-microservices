import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747664682044 implements MigrationInterface {
  name = 'Migration1747664682044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_completed_test\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`level\` varchar(16) NOT NULL,
      \`userUid\` int NOT NULL,
      \`testLength\` int NOT NULL DEFAULT '10',
      \`testCompleted\` int NOT NULL DEFAULT '0',
      UNIQUE INDEX \`IDX_ed1fd86fd69581063a139e9b17\` (\`level\`, \`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_ed1fd86fd69581063a139e9b17\` ON \`lesson_completed_test\``,
    );
    await queryRunner.query(`DROP TABLE \`lesson_completed_test\``);
  }
}
