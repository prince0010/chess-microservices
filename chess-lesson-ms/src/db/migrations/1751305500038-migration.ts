import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751305500038 implements MigrationInterface {
  name = 'Migration1751305500038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bot_user_record_game\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`botId\` int NOT NULL,
      \`pgn\` text NOT NULL,
      \`whitePlayer\` varchar(255) NOT NULL,
      \`blackPlayer\` varchar(255) NOT NULL,
      \`result\` varchar(16) NOT NULL DEFAULT '*',
      \`datePlayed\` timestamp NOT NULL,
      \`event\` varchar(255) NOT NULL DEFAULT 'Online Bot Match',
      \`site\` varchar(255) NOT NULL DEFAULT 'WeChess App',
      \`setup\` varchar(10) NOT NULL DEFAULT '1',
      \`plyCount\` int NOT NULL DEFAULT '0',
      \`currentFen\` text NULL,
      \`isGameFinished\` tinyint NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` ADD CONSTRAINT \`FK_db539657bde4b28f64ff951b0d3\` FOREIGN KEY (\`botId\`) REFERENCES \`bot\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot_user_record_game\` DROP FOREIGN KEY \`FK_db539657bde4b28f64ff951b0d3\``,
    );
    await queryRunner.query(`DROP TABLE \`bot_user_record_game\``);
  }
}
