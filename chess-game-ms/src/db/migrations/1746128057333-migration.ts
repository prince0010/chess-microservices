import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746128057333 implements MigrationInterface {
  name = 'Migration1746128057333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tetris_user_history\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`bestScore\` int NOT NULL DEFAULT '0',
      UNIQUE INDEX \`IDX_5335ab882454f21c23fa652783\` (\`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_5335ab882454f21c23fa652783\` ON \`tetris_user_history\``,
    );
    await queryRunner.query(`DROP TABLE \`tetris_user_history\``);
  }
}
