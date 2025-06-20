import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750452402042 implements MigrationInterface {
  name = 'Migration1750452402042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`world_chess_champion_level_completed\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`counter\` int NOT NULL DEFAULT '0',
      \`worldChessChampionLevelId\` int NOT NULL,
      UNIQUE INDEX \`IDX_e37e0eb1b6eccee074826f6a7d\` (\`worldChessChampionLevelId\`, \`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`world_chess_champion_level\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`level\` varchar(16) NOT NULL,
      \`points\` int NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`world_chess_champion_game\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`description\` text NULL,
      \`moves\` text NOT NULL,
      \`pgnRaw\` text NOT NULL,
      \`fen\` varchar(255) NULL,
      \`event\` varchar(255) NOT NULL DEFAULT '?',
      \`site\` varchar(255) NOT NULL DEFAULT '?',
      \`date\` varchar(255) NOT NULL DEFAULT '????.??.??',
      \`round\` varchar(255) NOT NULL DEFAULT '?',
      \`white\` varchar(255) NOT NULL DEFAULT '?',
      \`black\` varchar(255) NOT NULL DEFAULT '?',
      \`result\` varchar(255) NOT NULL DEFAULT '*',
      \`setup\` varchar(255) NOT NULL DEFAULT '0',
      \`plyCount\` int NOT NULL,
      \`showHint\` tinyint NOT NULL DEFAULT 0,
      \`hints\` json NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`world_chess_champion_level_completed\` ADD CONSTRAINT \`FK_721c9299c63e349842a21c04c1f\` FOREIGN KEY (\`worldChessChampionLevelId\`) REFERENCES \`world_chess_champion_level\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`world_chess_champion_level_completed\` DROP FOREIGN KEY \`FK_721c9299c63e349842a21c04c1f\``,
    );
    await queryRunner.query(`DROP TABLE \`world_chess_champion_game\``);
    await queryRunner.query(`DROP TABLE \`world_chess_champion_level\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e37e0eb1b6eccee074826f6a7d\` ON \`world_chess_champion_level_completed\``,
    );
    await queryRunner.query(
      `DROP TABLE \`world_chess_champion_level_completed\``,
    );
  }
}
