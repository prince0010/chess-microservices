import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759782425666 implements MigrationInterface {
  name = 'Migration1759782425666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_advanced\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`filename\` varchar(64) NOT NULL,
      \`metadata\` json NOT NULL,
      \`movesTree\` json NOT NULL,
      \`description\` text NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`lesson_advanced\``);
  }
}
