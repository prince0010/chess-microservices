import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1740579038231 implements MigrationInterface {
  name = 'Migration1740579038231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`lesson\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`level\` varchar(255) NOT NULL DEFAULT 'Level 1',
            \`description\` text NOT NULL,
            \`pgn\` text NOT NULL,
            \`fen\` varchar(255) NOT NULL,
            \`points\` int NOT NULL,
            \`event\` varchar(255) NOT NULL DEFAULT '?',
            \`site\` varchar(255) NOT NULL DEFAULT '?',
            \`date\` varchar(255) NOT NULL DEFAULT '????.??.??',
            \`round\` varchar(255) NOT NULL DEFAULT '?',
            \`white\` varchar(255) NOT NULL DEFAULT '?',
            \`black\` varchar(255) NOT NULL DEFAULT '?',
            \`result\` varchar(255) NOT NULL DEFAULT '*',
            \`setup\` varchar(255) NOT NULL DEFAULT '1',
            \`plyCount\` int NOT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`lesson\``);
  }
}
